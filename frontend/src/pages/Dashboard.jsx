import AISummaryCard from '@/components/ai-summary-card';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './Expense-List';
import { useUserContext } from '@/store/UserContext';

export default function Dashboard() {
    const { user } = useUserContext();

    return (
        <div className=" bg-gray-50 p-4 sm:p-8 font-inter">
            <div className="max-w-7xl mx-auto space-y-6">
                {user?.name && <h2 className='text-center text-4xl font-extrabold font-sans uppercase'>
                    Welcome,  <span className='text-indigo-500'>{user.name}</span>
                </h2>}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-6">
                        <ExpenseForm />
                        <AISummaryCard />
                    </div>
                    <div className="lg:col-span-2">
                        <ExpenseList />
                    </div>
                </div>
            </div>
        </div>
    );
};
