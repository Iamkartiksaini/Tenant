import { cn } from "@/lib/utils";
import React from "react";

const DataTable = ({ columns, data, action, loading, pageSize = 10, error }) => {

    const isEmpty = data.length === 0;
    const isDataAvailable = !isEmpty && !loading;
    const haveEmptySpace = data.length < pageSize 

    const rowStyle = "px-6 py-3 text-left text-sm font-medium text-gray-700";
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300 shadow-sm">
                <thead className="bg-gray-100">
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} className={rowStyle}>
                                {col.header}
                            </th>
                        ))}
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
                    {isDataAvailable && data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                            {columns.map((col, colIndex) => (
                                <td
                                    key={colIndex}
                                    className="px-6 py-4 text-sm text-gray-800"
                                >
                                    {getValueData(row, col)}
                                </td>
                            ))}
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
        </div>
    );
};

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