import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, LayersControl, ImageOverlay} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// JAXA Earth API
import * as je from '../lib/jaxa.earth.esm.js';

// キャプチャ用のライブラリ
import html2canvas from 'html2canvas';
import { router } from '@inertiajs/react'

// --- 1. 選択肢のデータを定義 ---
const SATELLITE_LAYERS = [
    {
        id: 'sst',
        name: '海面水温 (温度)',
        url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/GHRSST_L4_MUR_Sea_Surface_Temperature/default/2024-05-01/GoogleMapsCompatible_Level7/{z}/{y}/{x}.png',
        maxNativeZoom: 7, 
        maxZoom: 18,      
        opacity: 0.6
    },
    {
        id: 'chlorophyll',
        name: 'クロロフィルa (植物プランクトン)',
        url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Aqua_L2_Chlorophyll_A/default/2024-05-01/GoogleMapsCompatible_Level7/{z}/{y}/{x}.png',
        maxNativeZoom: 7,
        maxZoom: 18,
        opacity: 0.7
    },
    {
        id: 'true_color',
        name: '可視光 (実際の見た目)',
        url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/2024-05-01/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg',
        maxNativeZoom: 9,
        maxZoom: 18,
        opacity: 0.8
    }
];

const REGIONS = [
    { id: 'japan', name: '日本列島全体', center: [38.0, 137.0], zoom: 5 },
    { id: 'suruga', name: '静岡・駿河湾', center: [34.768, 138.500], zoom: 9 },
    { id: 'kuroshio', name: '黒潮海域（四国沖）', center: [32.0, 134.0], zoom: 6 },
];

function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap();
    map.setView(center, zoom); 
    return null; 
}



export default function MapViewer() {
    const [selectedLayer, setSelectedLayer] = useState(SATELLITE_LAYERS[0]);
    const [selectedRegion, setSelectedRegion] = useState(REGIONS[0]);
    const [jaxaImageUrl, setJaxaImageUrl] = useState<string | null>(null);

    // スナップショット用のState
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [comment, setComment] = useState("");
    const [isCapturing, setIsCapturing] = useState(false);

    useEffect(() => {
        const fetchJaxaData = async () => {
            try {
                const dataObject = await je.getDataObject({
                    collectionUrl: "https://s3.ap-northeast-1.wasabisys.com/je-pds/cog/v1/JAXA.EORC_ALOS.PRISM_AW3D30.v3.2_global/collection.json",
                    bbox: [-180, -90, 180, 90], 
                    width: 1000,
                    height: 500,
                });
                const colorMap = new je.image.ColorMap({ min: 0, max: 6000, colors: je.Colors.JET });
                const canvas = je.image.createCanvas(dataObject, colorMap);
                setJaxaImageUrl(canvas.toDataURL());
            } catch (error) {
                console.error("JAXA地形データの取得に失敗しました:", error);
            }
        };
        fetchJaxaData();
    }, []);

    // スナップショットを撮影する関数
    const takeSnapshot = async () => {
        setIsCapturing(true);
        const mapElement = document.getElementById('capture-target');
        if (mapElement) {
            try {
                const canvas = await html2canvas(mapElement, { useCORS: true });
                setCapturedImage(canvas.toDataURL('image/png'));
            } catch (error) {
                console.error("キャプチャに失敗しました", error);
                alert("画像のキャプチャに失敗しました。");
            }
        }
        setIsCapturing(false);
    };

    // 保存ボタンを押したときの処理
    const handleSaveSnapshot = async() => {
        if (!capturedImage) return;
        try{

            const response = await fetch(capturedImage);
            const blob = await response.blob();

            //multiparat/form-data
            const formData = new FormData()
            formData.append('image', blob, 'snapshot.png');

            if(comment ){
                formData.append('comment', comment)
            }

            //Inertia.jsを使ってPOST送信
            router.post('/snapshots', formData, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: ()=> {
                    alert("データベースの保存が完了しました");
                    setCapturedImage(null);
                    setComment("");
                }
            });
        } catch (error){
            console.error("画像データの変換中にエラーが発生しました:", error);
        }        


    };



    return (
        <div className="flex flex-col gap-4 relative">
            
            {/* 上部：コントロールパネル */}
            <div className="flex flex-wrap gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">表示データ (NASA)</label>
                    <select 
                        className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={selectedLayer.id}
                        onChange={(e) => {
                            const layer = SATELLITE_LAYERS.find(l => l.id === e.target.value);
                            if (layer) setSelectedLayer(layer);
                        }}
                    >
                        {SATELLITE_LAYERS.map(layer => (
                            <option key={layer.id} value={layer.id}>{layer.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">観測エリア</label>
                    <select 
                        className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={selectedRegion.id}
                        onChange={(e) => {
                            const region = REGIONS.find(r => r.id === e.target.value);
                            if (region) setSelectedRegion(region);
                        }}
                    >
                        {REGIONS.map(region => (
                            <option key={region.id} value={region.id}>{region.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 下部：地図本体 */}
            <div className="relative">
                {/* キャプチャの対象エリア */}
                <div id="capture-target" style={{ height: '600px', width: '100%', borderRadius: '8px', overflow: 'hidden', zIndex: 1 }}>
                    <MapContainer 
                        center={selectedRegion.center as [number, number]} 
                        zoom={selectedRegion.zoom} 
                        scrollWheelZoom={true} 
                        style={{ height: '100%', width: '100%', zIndex: 0 }}
                    >
                        <MapUpdater center={selectedRegion.center as [number, number]} zoom={selectedRegion.zoom} />

                        <LayersControl position="topright">
                            <LayersControl.BaseLayer checked name="標準マップ (OpenStreetMap)">
                                <TileLayer
                                    attribution='&copy; OpenStreetMap'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                            </LayersControl.BaseLayer>

                            <LayersControl.Overlay name="JAXA 地形データ (AW3D 全球)">
                                {jaxaImageUrl && (
                                    <ImageOverlay
                                        url={jaxaImageUrl}
                                        bounds={[[-90, -180], [90, 180]]} 
                                        opacity={0.5} 
                                    />
                                )}
                            </LayersControl.Overlay>
                        </LayersControl>

                        <TileLayer
                            key={selectedLayer.id} 
                            url={selectedLayer.url}
                            opacity={selectedLayer.opacity}
                            maxNativeZoom={selectedLayer.maxNativeZoom}
                            maxZoom={selectedLayer.maxZoom}
                        />
                        
                        <CircleMarker 
                            center={[34.5, 138.5]}
                            pathOptions={{ color: 'red', fillColor: '#f03', fillOpacity: 0.8 }} 
                            radius={10}
                        >
                            <Popup>観測ポイントA</Popup>
                        </CircleMarker>
                    </MapContainer>
                </div>

                {/* スナップショット撮影ボタン */}
                <button
                    onClick={takeSnapshot}
                    disabled={isCapturing}
                    className="absolute bottom-6 right-6 z-[1000] bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition transform hover:scale-105"
                >
                    {isCapturing ? "撮影中..." : "📸 スナップショットを撮る"}
                </button>
            </div>

            {/* 画像とコメントの入力モーダル */}
            {capturedImage && (
                <div className="fixed inset-0 z-[2000] bg-black bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-3xl w-full p-6 shadow-2xl flex flex-col gap-4">
                        <h3 className="text-xl font-bold text-gray-800">スナップショットの保存</h3>
                        
                        <div className="border border-gray-200 rounded-md overflow-hidden bg-gray-50 flex justify-center">
                            <img src={capturedImage} alt="Snapshot" className="max-w-full h-auto max-h-[400px] object-contain" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">気づき・コメント</label>
                            <textarea
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                rows={3}
                                placeholder="例: 静岡沖の海面水温が平年より高く、赤潮発生の懸念あり。"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="flex justify-end gap-3 mt-2">
                            <button
                                onClick={() => setCapturedImage(null)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={handleSaveSnapshot}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                            >
                                データベースに保存する
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}