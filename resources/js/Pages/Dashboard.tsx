import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import MapViewer from '@/Components/MapViewer';

export default function Dashboard({ auth }: PageProps) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                    Earth Data Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12 relative z-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* 白背景をダークグラスモーフィズムに変更 */}
                    <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] sm:rounded-2xl relative">
                        
                        {/* カード上部のアクセントライン */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

                        <div className="p-6 sm:p-8 text-gray-300">
                            {/* 地図コンポーネントを表示 */}
                            <MapViewer />
                        </div>
                    </div>
                    
                </div>
            </div>
        </AuthenticatedLayout>
    );
}