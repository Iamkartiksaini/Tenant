import { cn } from "@/lib/utils";
import React, { useState } from "react";
import MultiSelect from "./ui/multi-select";
import { ArrowDownWideNarrow, ArrowUpNarrowWide, Funnel } from "lucide-react";

const DataTable = ({ columns, data, action, loading, pageSize = 10, error }) => {

    const [filter, setFilter] = useState(() => {
        let obj = {}
        columns?.forEach(c => {
            if (c?.filter) {
                obj[c.field] = { sort: 0, ...c?.filter }
            }
        })
        return obj
    });

    const [activeFields, setActiveFields] = useState(() => renderCols(columns));

    const isEmpty = data.length === 0;
    const isDataAvailable = !isEmpty && !loading;
    const haveEmptySpace = data.length < pageSize;
    const dataClone = structuredClone(data);

    // Applying Filter on Active Fields ----
    Object.keys(filter).forEach(k => {
        // cf_state = current field filter state 
        const cf_state = filter[k];

        if (!activeFields.includes(k) || cf_state?.sort === 0) return null;

        const cf_methods = cf_state?.methods

        if (cf_methods) {
            const isSortFunctionGiven = Object.keys(cf_methods)?.length > 0 &&
                cf_methods[cf_state?.sort]

            if (isSortFunctionGiven) {
                const sortMethod = cf_methods[cf_state?.sort]
                dataClone.sort(sortMethod(k))
            }
        }
        else {
            dataClone.sort((a, b) => cf_state.sort == 1 ? a[k] - b[k] : b[k] - a[k]);
        }
    })

    // Filter Toggle on Field Handler ----
    function toggleFilter(field, prevState) {
        return () => {
            const states = [0, 1, -1];
            const current = prevState?.sort ?? 0;
            const nextToggleState = states[(states.indexOf(current) + 1) % states.length];
            setFilter(prev => ({ ...prev, [field]: { ...prev[field], sort: nextToggleState } }))
        }
    }

    // Render on Filter Icon ----
    function RenderFilterIcon({ col, ...props }) {
        const registerKey = filter[col.field]
        if (!registerKey) return null
        if (registerKey.sort === 0) return <Funnel {...props} />;
        let Icon = registerKey.sort == 1 ? ArrowDownWideNarrow : ArrowUpNarrowWide;
        return <Icon {...props} />
    }

    const rowStyle = "px-6 py-3 text-left text-sm font-medium text-gray-700";
    return (
        <div className="overflow-x-auto">
            <div className="flex justify-between items-center my-2  p-2 rounded-sm">
                <div className="">
                </div>
                <MultiSelect items={columns}
                    initialSelected={activeFields} optionLabel={"header"}
                    optionValue="field" activeFields={activeFields} setActiveFields={setActiveFields} />
            </div>
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300 shadow-sm">
                <thead className="bg-gray-100 ">
                    <tr>
                        {columns.map((col, index) => {
                            if (!activeFields.includes(col?.field)) return null;
                            const currentFilterState = filter[col?.field]
                            return (
                                <th key={index} className={rowStyle}>
                                    <span className="flex items-center gap-1">
                                        {col?.header}
                                        {col?.filter &&
                                            <button
                                                title={col?.header + "-filter-toggle"}
                                                onClick={toggleFilter(col?.field, currentFilterState)}
                                                className={cn("py-1 px-2 transition-colors cursor-pointer hover:bg-gray-300 rounded-sm",
                                                    currentFilterState?.sort !== 0 && "bg-indigo-400/50 hover:bg-indigo-400/50 active:bg-indigo-400/50",
                                                )}>
                                                <RenderFilterIcon col={col} height="13px" width="13px" />
                                            </button>}
                                    </span>
                                </th>
                            )
                        })}
                        {action?.header &&
                            <th className={rowStyle}>{action.header}</th>}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {loading && Array.from({ length: pageSize }).map((_, idx) => <EmptyRow key={idx} cols={columns} />)}
                    {error &&
                        <tr>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                {error}
                            </td>
                        </tr>}
                    {!error && isEmpty &&
                        <tr>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                no records found
                            </td>
                        </tr>}
                    {isDataAvailable && dataClone.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                            {columns.map((col, colIndex) => {
                                if (!activeFields.includes(col.field)) return null;
                                return (
                                    <td
                                        key={colIndex}
                                        className="px-6 py-4 text-sm text-gray-800"
                                    >
                                        {getValueData(row, col)}
                                    </td>
                                )
                            })}
                            {action?.body &&
                                <td
                                    className={rowStyle}
                                >
                                    {action?.body(row)}
                                </td>}
                        </tr>
                    ))}
                    {haveEmptySpace && Array.from({ length: pageSize - data.length }).map((_, index) => <EmptyRow loading={loading} cols={columns}
                        animation={false}
                        key={data.length + index} />)}
                </tbody>
            </table>
        </div >
    );
};


function renderCols(arr) {
    let obj = [];
    arr.map(col => {
        obj.push(col.field)
    })
    return obj
}

function EmptyRow({ cols = [1, 2, 3, 4], animation = true, loading = false }) {
    return <tr>
        {cols.map((_, index) => <td key={index}
            className="px-6 py-4 text-left text-sm font-medium text-gray-700"
        > <span className={cn("rounded-sm  block  bg-gray-100", loading || animation && "animate-pulse bg-gray-300")}>
                <span className="opacity-0"> Cell</span>
            </span> </td>)}
    </tr>
}

function getValueData(obj, header) {
    const keys = header?.field.split('.');
    let value = { ...obj };
    for (const key of keys) {
        if (value && key in value) {
            value = value[key];
        } else {
            return "";
        }
    }
    if (header?.body) {
        return header.body(value)
    }

    return value;
}

export default DataTable