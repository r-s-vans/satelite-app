import { useEffect, FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }: { status?: string, canResetPassword?: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Log in - Earth Data Explorer" />

            <div className="relative min-h-screen flex items-center justify-center bg-black text-white py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* 背景装飾（トップページと共通） */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-slate-900 z-0"></div>
                <div className="absolute inset-0 bg-[url('https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/2024-05-01/GoogleMapsCompatible_Level9/4/3/13.jpg')] opacity-10 bg-cover bg-center z-0 mix-blend-luminosity"></div>

                {/* ログインフォームのカード（グラスモーフィズム調） */}
                <div className="relative z-10 max-w-md w-full bg-gray-900/70 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700">
                    <div className="text-center mb-8">
                        <Link href="/" className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                            Earth Data Explorer
                        </Link>
                        <h2 className="mt-4 text-xl text-gray-300 font-medium">システムにログイン</h2>
                    </div>

                    {status && <div className="mb-4 font-medium text-sm text-green-400">{status}</div>}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">メールアドレス</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">パスワード</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            {errors.password && <p className="mt-2 text-sm text-red-400">{errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember_me"
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-4 w-4 text-indigo-500 focus:ring-indigo-500 border-gray-600 bg-gray-800 rounded"
                                />
                                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-300">
                                    ログイン状態を保存
                                </label>
                            </div>

                            {canResetPassword && (
                                <div className="text-sm">
                                    <Link href={route('password.request')} className="font-medium text-indigo-400 hover:text-indigo-300 transition">
                                        パスワードをお忘れですか？
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition transform hover:-translate-y-0.5 disabled:opacity-50"
                            >
                                {processing ? '処理中...' : 'ログイン'}
                            </button>
                        </div>
                    </form>
                    
                    <div className="mt-6 text-center text-sm text-gray-400">
                        アカウントをお持ちでない場合は <Link href={route('register')} className="text-indigo-400 hover:text-indigo-300 transition font-medium">新規登録</Link>
                    </div>
                </div>
            </div>
        </>
    );
}