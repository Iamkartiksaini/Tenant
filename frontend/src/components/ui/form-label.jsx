import { Controller } from "react-hook-form"
import { Input } from '@/components/ui/input'
import { cn } from "@/lib/utils"

export function ReactHookField({ control, registerKey, label, errors, fieldType = "text",inputProps ={}, placeholder = "" }) {
    return <div className="flex mt-2 gap-1 flex-wrap items-center relative ">
        <label className='text-nowrap text-sm font-semibold w-[100px]'  htmlFor={registerKey}>{label}</label>
        <Controller
            name={registerKey}
            control={control}
            render={({ field }) => <Input id={registerKey} type={fieldType} {...field} placeholder={placeholder} {...inputProps} />}
        />
        <ErrorMessage errors={errors} registerKey={registerKey} />
    </div>
}

function x() { }
export function SelectField({ dependField = x, control, registerKey, label, errors, options, optionLabel = null, optionValue = null, placeholder }) {

    return <div className="flex mt-2 gap-1 flex-wrap relative pb-1.5">
        <label className='text-nowrap text-sm font-semibold w-[100px]' htmlFor={registerKey}>{label}</label>
        <Controller
            defaultValue={""}
            name={registerKey}
            control={control}
            render={({ field }) => <select className={inputClass} {...field} onChange={(e) => {
                dependField()
                field.onChange(e)
            }}>
                <option value="">{placeholder}</option>
                {options.map((val) => <option value={!optionValue ? val : val[optionValue]}
                    key={!optionLabel ? val : val[optionLabel]}>{!optionLabel ? val : val[optionLabel]}</option>)}
            </select>}
        />
        <ErrorMessage errors={errors} registerKey={registerKey} />
    </div>
}

export function ErrorMessage({ errors, registerKey }) {
    const paths = registerKey.split(".")
    let result = get(paths, errors)
    if (!result?.message) return null
    return <span className='flex-1  text-xs font-semibold text-red-400'>{result?.message}</span>
}


export const inputClass = cn(
    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",)

function get(keys, err) {
    let isContinue = true
    let result = err
    keys.forEach(key => {
        if (!isContinue) return
        if (result[key]) {
            result = result[key]
            return
        }
        result = null
        isContinue = false
        return
    })
    return result
}