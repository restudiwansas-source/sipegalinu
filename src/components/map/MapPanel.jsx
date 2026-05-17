import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { useAppStore } from "../../store/appStore";

export default function MapPanel() {
  const mapRef = useRef(null), leafletRef = useRef(null), satelliteRef = useRef(null), streetRef = useRef(null);
  const [satellite, setSatellite] = useState(false);
  const { blocks, setSelectedBlock, setActiveTab, setToast } = useAppStore();

  useEffect(()=> {
    if (!mapRef.current || leafletRef.current) return;
    const map = L.map(mapRef.current, { zoomControl:false, attributionControl:false }).setView([-7.1327,108.1730],15);
    leafletRef.current = map;
    streetRef.current = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom:19 }).addTo(map);
    satelliteRef.current = L.tileLayer("https://mt1.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}", { maxZoom:21 });
    L.control.zoom({ position:"topright" }).addTo(map);
    return ()=>{ map.remove(); leafletRef.current=null; };
  },[]);

  useEffect(()=> {
    const map = leafletRef.current; if (!map) return;
    const layerGroup = L.layerGroup().addTo(map);
    blocks.forEach((block, idx)=> {
      const lat = Number(block.lat || -7.1327 - idx*.001), lng = Number(block.lng || 108.1730 + idx*.001), color = block.color || "#2d5a3d", s = .0018;
      const poly = L.polygon([[lat-s,lng-s],[lat-s,lng+s],[lat+s,lng+s],[lat+s,lng-s]], { color, fillColor:color, fillOpacity:.28, weight:2 }).addTo(layerGroup);
      poly.bindPopup(`<b>${block.nama_blok}</b><br/>Kode: ${block.kode_blok}<br/>Objek: ${block.jumlah_objek || 0}<br/><small>Klik area untuk lihat PDF</small>`);
      poly.on("click",()=>{setSelectedBlock(block);setActiveTab("pdf")});
      const c = poly.getBounds().getCenter();
      L.marker(c,{ icon:L.divIcon({ html:`<div style="background:${color};color:white;padding:4px 9px;border-radius:8px;font-size:11px;font-weight:800;box-shadow:0 2px 8px rgba(0,0,0,.3);white-space:nowrap">Blok ${block.kode_blok}</div>`, className:"", iconAnchor:[32,12] }) }).addTo(layerGroup);
    });
    return ()=>layerGroup.remove();
  },[blocks,setActiveTab,setSelectedBlock]);

  function toggleLayer() {
    const map = leafletRef.current; if (!map) return;
    if (!satellite) { map.removeLayer(streetRef.current); satelliteRef.current.addTo(map); setToast("🛰️ Mode satelit aktif"); }
    else { map.removeLayer(satelliteRef.current); streetRef.current.addTo(map); setToast("🗺️ Mode peta aktif"); }
    setSatellite(!satellite);
  }
  function locateMe() {
    const map = leafletRef.current;
    if (!map || !navigator.geolocation) return setToast("Geolocation tidak tersedia");
    navigator.geolocation.getCurrentPosition((pos)=> {
      const { latitude, longitude } = pos.coords;
      map.setView([latitude, longitude], 17);
      L.marker([latitude, longitude]).addTo(map).bindPopup("📍 Lokasi Anda").openPopup();
    },()=>setToast("Gagal mendapatkan lokasi"));
  }

  return (
    <section className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
        <button onClick={()=>leafletRef.current?.setView([-7.1327,108.1730],15)} className="w-11 h-11 rounded-xl bg-white shadow-md">🏠</button>
        <button onClick={toggleLayer} className="w-11 h-11 rounded-xl bg-white shadow-md">🛰️</button>
        <button onClick={locateMe} className="w-11 h-11 rounded-xl bg-white shadow-md">📍</button>
      </div>
      <div className="absolute bottom-4 left-3 z-[1000] bg-white rounded-2xl p-3 shadow-md text-xs">
        <h4 className="font-black mb-2">Legenda Blok</h4>
        <div className="space-y-1 max-h-40 overflow-auto">{blocks.map((b)=><div key={b.id} className="flex items-center gap-2"><span style={{background:b.color || "#2d5a3d"}} className="w-3 h-3 rounded-sm" /><span>Blok {b.kode_blok}</span></div>)}</div>
      </div>
    </section>
  );
}
