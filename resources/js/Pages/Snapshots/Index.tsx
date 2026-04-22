import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
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

export default function Index({ auth, snapshots }: PageProps<{ snapshots: Snapshot[] }>) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">スナップショット一覧</h2>}
        >
            <Head title="Snapshots" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* 画像をカード状に並べるグリッドレイアウト */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        
                        {snapshots.map((snap) => (
                            <div key={snap.id} className="bg-white overflow-hidden shadow-sm sm:rounded-lg flex flex-col">
                                {/* 保存された画像を表示 */}
                                <img src={snap.image_path} alt="Snapshot" className="w-full h-auto border-b border-gray-200" />
                                
                                {/* コメントと撮影者情報 */}
                                <div className="p-4 flex-grow flex flex-col justify-between">
                                    <p className="text-gray-900 font-medium whitespace-pre-wrap mb-4">
                                        {snap.comment || '（コメントなし）'}
                                    </p>
                                    <div className="text-sm text-gray-500 flex justify-between border-t pt-2 border-gray-100">
                                        <span>撮影: {snap.user.name}</span>
                                        <span>{new Date(snap.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* 1枚もスナップショットがない時のメッセージ */}
                        {snapshots.length === 0 && (
                            <div className="col-span-full text-center py-12 text-gray-500 bg-white shadow-sm sm:rounded-lg">
                                まだスナップショットがありません。ダッシュボードの地図から撮影してみましょう！
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}