import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';

// スナップショットのデータ型を定義
interface Snapshot {
    id: number;
    image_path: string;
    comment: string | null;
    created_at: string;
    user: {
        name: string;
    };
}

interface PaginatedData<T>{
    data: T[];
    current_page: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean}[];
}

export default function Index({ auth, snapshots }: PageProps<{ snapshots: PaginatedData<Snapshot> }>) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                    スナップショット一覧
                </h2>
            }
        >
            <Head title="Snapshots" />

            <div className="py-12 relative z-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* 画像をカード状に並べるグリッドレイアウト */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        
                        {snapshots.data.map((snap) => (
                            <div 
                                key={snap.id} 
                                // ホバー時の浮遊エフェクト
                                className="bg-gray-900/80 backdrop-blur-md border border-gray-700 overflow-hidden shadow-xl sm:rounded-2xl flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(79,70,229,0.3)] relative group"
                            >
                                {/* カード上部のアクセントライン */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/50 to-indigo-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* 保存された画像を表示 */}
                                <img 
                                    src={snap.image_path} 
                                    alt="Snapshot" 
                                    className="w-full h-auto border-b border-gray-700 object-cover" 
                                />
                                
                                {/* コメントと撮影者情報 */}
                                <div className="p-5 flex-grow flex flex-col justify-between">
                                    <p className="text-gray-200 font-medium whitespace-pre-wrap mb-4 leading-relaxed">
                                        {snap.comment ? snap.comment : <span className="text-gray-500 italic">（コメントなし）</span>}
                                    </p>
                                    <div className="text-xs text-gray-400 flex justify-between items-end border-t border-gray-700/50 pt-3 mt-auto">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                            {snap.user?.name || auth.user.name}
                                        </span>
                                        <span className="font-mono">{new Date(snap.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* 1枚もスナップショットがない時のメッセージ（ダークテーマ対応） */}
                        {snapshots.data.length === 0 && (
                            <div className="col-span-full text-center py-16 text-gray-400 bg-gray-900/80 backdrop-blur-md border border-gray-700 shadow-xl sm:rounded-2xl">
                                まだスナップショットがありません。<br/>ダッシュボードの地図から撮影してみましょう！
                            </div>  
                        )}
                    </div>
                    {snapshots.last_page > 1 && (
                        <div className='mt-10 flex justify-center items-center flex-wrap gap-2'>
                            {snapshots.links.map((link,index) => (
                                <Link
                                key={index}
                                href= {link.url || '#'}
                                onClick={(e) => !link.url && e.preventDefault()}
                                className={`px-4 &{
                                    link.active
                                    ? 'bg-gray'
                                    :link.url
                                    ? 'bg-gray-800/80 '
                                    : 'bg-gray-900/50 '

                                }`}
                                dangerouslySetInnerHTML ={{__html: link.label}}
                                />
                            ))}

                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}