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
}
    