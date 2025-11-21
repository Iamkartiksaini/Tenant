import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createExpense } from "@/api/service";
import { useState } from "react";
import { EXPENSE_CATEGORIES, ExpenseSchema } from "@/lib/validations";
import { ReactHookField, SelectField } from "@/components/ui/form-label";

const INIT_FORM_STATE = {
    title: "",
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
}

const ExpenseForm = () => {
    const [apiLoading, setApiLoading] = useState(false);
    const [error, setError] = useState("");

    const {
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(ExpenseSchema),
        defaultValues: INIT_FORM_STATE,
    });

    const onSubmit = async (data) => {
        setError("");
        setApiLoading(true);
        try {
            await createExpense({
                title: data.title.trim(),
                category: data.category,
                amount: Number(data.amount),
                date: data.date,
            });
            reset(INIT_FORM_STATE);
        } catch (err) {
            console.error(err);
            setError("Failed to add expense. Check console for details.");
        } finally {
            setApiLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
            <h2 className="text-2xl font-sans font-bold text-indigo-600 mb-4">
                Add New Expense
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Title */}
                <ReactHookField control={control} label={"Title"} registerKey={"title"} errors={errors}
                    placeholder="Enter expense title" />

                {/* Category */}
                <SelectField control={control} label={"Category"} registerKey={"category"} errors={errors} options={EXPENSE_CATEGORIES} placeholder="Select Expense Category..." />

                {/* Amount */}
                <ReactHookField fieldType="number" inputProps={{ min: 1 }} control={control} label={"Amount"} registerKey={"amount"} errors={errors}
                    placeholder="Enter amount" />

                {/* Date */}
                <ReactHookField fieldType="date" control={control} label={"Date"} registerKey={"date"} errors={errors} />

                {/* Server error */}
                {error && <p className="text-sm text-red-500">{error}</p>}

                <button
                    type="submit"
                    className="w-full bg-indigo-500 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 disabled:bg-indigo-300"
                    disabled={apiLoading || isSubmitting}
                >
                    {apiLoading ? "Adding…" : "Add Expense"}
                </button>
            </form>
        </div>
    );
};

export default ExpenseForm;
