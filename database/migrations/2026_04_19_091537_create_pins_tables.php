<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pins_tables', function (Blueprint $table) {
            $table-> uuid()->primary();

            $table->geometry('geom');

            // ピンのタイトル（例: 「赤潮発生疑いあり」）
            $table->string('title');

            //空間データ（点）
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pins_tables');
    }
};
