import BackButton from '@/components/back-button';
import DataTable from '@/components/DataTable'
import { Button } from '@/components/ui/button';
import Pagination from '@/components/Pagination';
import { useExpenseApi } from '@/hook/useExpenseApi';
import { formatDate } from '@/lib/timeFormatter';
import { Funnel, RefreshCcw } from 'lucide-react';

export default function TableView() {

    const {
        data,
        loading,
        error,
        currentPage,
        pageSize,
        totalPages,
        updatePageIndex,
        updatePageSize,
        refetch,
    } = useExpenseApi({ init: [] });


    function renderCategory(label) {
        return <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-medium">
            {label}
        </span>
    }

    const cols = [
        { header: "Id", field: "_id", },
        {
            header: "Title", field: "title", filter: {
                methods: { [1]: sortStringsAsc, [-1]: sortStringsDesc }
            }
        },
        { header: "Amount", field: "amount", filter: true },
        { header: "Category", field: "category", body: renderCategory },
        {
            header: "Date", field: "date", body: formatDate,
            filter: { methods: { [1]: sortByISODateAsc, [-1]: SortByISODateDesc } }
        },
    ]

    const tableProps = {
        data, columns: cols, pageSize,
        error
    }

    const paginationProps = {
        currentPage,
        dataLength: totalPages?.items,
        itemsPerPage: pageSize,
        totalPages: totalPages?.pages,
        isLoading: loading,
        setCurrentPage: updatePageIndex,
        updatePageSize: updatePageSize
    }


    function sortByISODateAsc(key) {
        return (a, b) => {
            const dateA = new Date(a[key]).getTime();
            const dateB = new Date(b[key]).getTime();
            return dateA - dateB;
        }
    };

    function SortByISODateDesc(key) {
        return (a, b) => {
            const dateA = new Date(a[key]).getTime();
            const dateB = new Date(b[key]).getTime();
            return dateB - dateA;
        }
    };


    function sortStringsAsc(key) {
        return (a, b) => a[key].localeCompare(b[key]);
    }

    function sortStringsDesc(key) {
        return (a, b) => b[key].localeCompare(a[key]);
    }


    function fetchData() {
        refetch()
    }
    
    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8 flex justify-center items-start">
            <div className='w-full max-w-7xl bg-white shadow-2xl rounded-xl p-4 sm:p-8 '>
                <div className="flex flex-col bg-white rounded-tl-sm  rounded-tr-sm sm:flex-row justify-between items-center pb-4">
                    <div className="flex gap-4 w-full items-center ">
                        <BackButton />
                        <h2 className="text-2xl font-sans font-bold text-gray-800">
                            Expense <span className='text-indigo-500'>History</span>
                        </h2>
                    </div>
                    <Button onClick={fetchData}
                        disabled={loading} className={"bg-indigo-600"} title="Refresh Data">
                        <RefreshCcw className={loading && 'animate-spin'} />
                    </Button>
                </div>
                <DataTable {...tableProps} loading={loading} />
                {!error && <div className="bg-white rounded-bl-sm  rounded-br-sm">
                    <Pagination  {...paginationProps} />
                </div>}
            </div>
        </div>
    )
}
