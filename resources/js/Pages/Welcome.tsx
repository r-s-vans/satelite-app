import { Link, Head } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Welcome({ auth, laravelVersion, phpVersion }: PageProps<{ laravelVersion: string, phpVersion: string }>) {
    return (
        <>
            {/* ブラウザのタブに表示されるタイトル */}
            <Head title="Welcome - Earth Data Explorer" />
            
            {/* 画面全体を黒系の背景に設定 */}
            <div className="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-black text-white selection:bg-indigo-500 selection:text-white overflow-hidden">
                
                {/* 背景の装飾効果（グラデーションと、かすかに透けるNASAの衛星画像） */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-slate-900 z-0"></div>
                <div className="absolute inset-0 bg-[url('https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/2024-05-01/GoogleMapsCompatible_Level9/4/3/13.jpg')] opacity-10 bg-cover bg-center z-0 mix-blend-luminosity"></div>

                <div className="relative z-10 w-full max-w-4xl p-6 lg:p-8 flex flex-col items-center justify-center min-h-screen">
                    
                    {/* タイトル・キャッチコピー部分 */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 mb-6 drop-shadow-2xl">
                            Earth Data Explorer
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
                            NASA衛星データとJAXA全球地形データを利用し、<br className="hidden md:block" />
                            地球環境の「今」を可視化する空間情報プラットフォーム。
                        </p>
                    </div>

                    {/* ボタンエリア */}
                    <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md justify-center">
                        {/* ログイン済みの場合はダッシュボードへのリンクを表示 */}
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="w-full text-center px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(79,70,229,0.4)] transition duration-300 ease-in-out transform hover:-translate-y-1"
                            >
                                ダッシュボードへ進む
                            </Link>
                        ) : (
                            /* ログインしていない場合のボタン2つ */
                            <>
                                <Link
                                    href={route('login')}
                                    className="w-full text-center px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-bold rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:border-gray-400"
                                >
                                    ログイン
                                </Link>

                                <Link
                                    href={route('register')}
                                    className="w-full text-center px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(79,70,229,0.4)] transition duration-300 ease-in-out transform hover:-translate-y-1"
                                >
                                    新規アカウント登録
                                </Link>
                            </>
                        )}
                    </div>

                    {/* フッター情報 */}
                    <div className="absolute bottom-6 text-center text-sm text-gray-600 font-mono">
                        Powered by Laravel v{laravelVersion} & PHP v{phpVersion}
                    </div>
                </div>
            </div>
        </>
    );
}