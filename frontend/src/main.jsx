import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')).render(
        <App />
)


// function CounterApp() {
//     const data = useSelector((state) => state.count)
//     const { value } = data;
//     const dispatch = useDispatch()
//     return (
//         <div className='p-8'>
//             <code>{JSON.stringify(data)}</code>
//             <br />
//             <button
//                 className='px-4 py-2 bg-slate-200'
//                 onClick={() => dispatch(fetchUserOne(5))}>Count {value}</button>
//         </div>)
// }
