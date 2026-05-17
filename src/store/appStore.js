import { create } from "zustand";
import { createDemoObjects, defaultSettings, demoBlocks, defaultMenus, defaultRoles, demoUsers } from "../data";

export const useAppStore = create((set, get) => ({
  user:null,
  activeTab:"beranda",
  blocks:demoBlocks,
  selectedBlock:demoBlocks[0],
  objects:createDemoObjects(demoBlocks),
  toast:"",
  settings:defaultSettings,
  menus:defaultMenus,
  roles:defaultRoles,
  users:demoUsers,
  adminOpen:false,

  setUser:(user)=>set({ user }),
  logout:()=>set({ user:null, activeTab:"beranda", adminOpen:false }),
  setActiveTab:(activeTab)=>set({ activeTab }),
  setBlocks:(blocks)=>set({ blocks, selectedBlock:blocks[0] || null, objects:createDemoObjects(blocks) }),
  setSelectedBlock:(selectedBlock)=>set({ selectedBlock }),
  setToast:(toast)=>{
    set({ toast });
    if (toast) setTimeout(()=>{ if (get().toast === toast) set({ toast:"" }); }, 2600);
  },
  setSettings:(settings)=>set({ settings:{ ...get().settings, ...settings } }),
  setMenus:(menus)=>set({ menus }),
  setRoles:(roles)=>set({ roles }),
  setUsers:(users)=>set({ users }),
  setAdminOpen:(adminOpen)=>set({ adminOpen })
}));
