<?php

namespace App\Http\Controllers;

use App\Models\Snapshot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SnapshotController extends Controller
{
    // 1. 一覧画面を表示する処理
    public function index()
    {
        // 最新のものから順に、ユーザー情報付きで取得
        $snapshots = Snapshot::with('user')->latest()->get();
        
        return Inertia::render('Snapshots/Index', [
            'snapshots' => $snapshots
        ]);
    }

    // 2. スナップショットを保存する処理
    public function store(Request $request)
    {
        // バリデーション（画像データは必須）
        $request->validate([
            'image' => 'required|string',
            'comment' => 'nullable|string',
        ]);

        // Base64形式の画像文字列をデコードして、本物の画像データに変換
        $imageParts = explode(";base64,", $request->image);
        $imageBase64 = base64_decode($imageParts[1]);

        // ユニークなファイル名を生成（例: 64b5f... .png）
        $fileName = uniqid() . '.png';
        // storage/app/public/snapshots フォルダに保存
        $filePath = 'snapshots/' . $fileName;
        Storage::disk('public')->put($filePath, $imageBase64);

        // データベースに記録
        Snapshot::create([
            'user_id' => $request -> user()->id,
            'image_path' => '/storage/' . $filePath, // ブラウザからアクセスできるURLパス
            'comment' => $request->comment,
        ]);

        // 元の画面（ダッシュボード）に戻る
        return redirect()->back();
    }
}

    