<?php

namespace App\Http\Controllers;

use App\Models\Snapshot;
use App\Http\Requests\StoreSnapshotRequest; // 
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class SnapshotController extends Controller
{
    public function index()
    {
        // 最新のものから順に、ユーザー情報付きで取得
        $snapshots = Snapshot::with('user:id,name')->latest()->paginate(9);
        
        return Inertia::render('Snapshots/Index', [
            'snapshots' => $snapshots
        ]);
    }

    
    public function store(StoreSnapshotRequest $request) 
    {
        $path = $request->file('image')->store('snapshots', 'public');

        $request->user()->snapshots()->create([
            'image_path' => Storage::disk('public')->url($path),
            'comment'    => $request->validated('comment'),
        ]);

        return redirect()->back();
    }

    public function destroy(Snapshot $snapshot)
    {
        // 1. セキュリティ対策：他人の画像を勝手に消せないようにする
        if ($snapshot->user_id !== auth()->id()) {
            abort(403, 'この画像を削除する権限がありません。');
        }

        // 2. サーバーから実際の画像ファイル（.png）を削除する
        $filePath = str_replace('/storage/', '', $snapshot->image_path);
        Storage::disk('public')->delete($filePath);

        // 3. データベースの記録を削除する
        $snapshot->delete();

        // 4. 元の画面（一覧画面）に戻る
        return redirect()->back();
    }
}
    