import React, { Fragment, lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import NotFound from './not-found'
import { UserProvider, useUserContext } from './store/UserContext';

import Header from './components/header';
import Loading from './components/loading';
import TableView from './pages/TablePage';

import ErrorBoundary, { FallbackRender } from './RootErrorLayer';
import { ToastContainer } from 'react-toastify';

const Auth = lazy(() => import('./pages/Auth'));
const LoginForm = lazy(() => import('./components/login-form'));
const SignupForm = lazy(() => import('./components/signup-form'));

const Dashboard = lazy(() => import('./pages/Dashboard'));
const LineChart = lazy(() => import('./pages/ChartPage'));

export default function App() {
    return (
        <UserProvider>
            <ToastContainer />
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Layout />} >
                        <Route path='/auth' element={<Auth />}>
                            <Route path='register' element={<SignupForm />} />
                            <Route path='login' element={<LoginForm />} />
                            <Route index element={<Navigate to={"/auth/login"} />} />
                        </Route>
                        <Route path='/protected' element={<ProtectedPagesLayout />}>
                            <Route index element={<Navigate to={"dashboard"} />} />
                            <Route path='dashboard' element={<Dashboard />} />
                            <Route path='chart' element={<LineChart />} />
                            <Route path='table' element={<TableView />} />
                        </Route>
                        <Route index element={<Navigate to={"/auth/login"} />} />
                        <Route path='*' element={<NotFound rootClass='h-screen' />} />
                    </Route>
                    <Route path='' element={<NotFound rootClass='h-screen' />} />
                </Routes>
            </BrowserRouter>
        </UserProvider >
    )
}

function Layout() {
    const { pathname } = useLocation();
    const navigate = useNavigate()
    const { user, isAuthLoading } = useUserContext()

    useEffect(() => {
        // if user try to access protected route without login
        if (pathname.includes("protected") && isAuthLoading == false && user?.email == undefined) {
            navigate("/auth/login")
        }
        // if user logged in and accessing auth routes 
        if (pathname.includes("auth") && isAuthLoading == false && user?.email !== undefined) {
            navigate("/protected/dashboard")
        }
    }, [isAuthLoading, pathname, user?.email])

    return <ErrorBoundary fallback={<FallbackRender />}>
        <Header />
        <Suspense fallback={<div className='h-[calc(100vh-120px)] flex justify-center items-center'><Loading /> </div>}>
            <ErrorBoundary fallback={<FallbackRender />}>
                <Outlet />
            </ErrorBoundary>
        </Suspense>
    </ErrorBoundary>
}


function ProtectedPagesLayout() {
    return <Fragment>
        <Outlet />
    </Fragment>
}