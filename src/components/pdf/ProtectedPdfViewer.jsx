import {
  Viewer,
  Worker,
  SpecialZoomLevel,
} from "@react-pdf-viewer/core";

import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function ProtectedPdfViewer({ url }) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [],

    renderToolbar: (Toolbar) => (
      <Toolbar>
        {(slots) => {
          const {
            CurrentPageInput,
            NumberOfPages,
            GoToPreviousPage,
            GoToNextPage,
            ZoomOut,
            Zoom,
            ZoomIn,
            ShowSearchPopover,
            EnterFullScreen,
          } = slots;

          return (
            <div className="w-full flex items-center gap-2 px-2 py-2 bg-zinc-800 text-white overflow-x-auto">
              <div className="flex items-center gap-1 shrink-0">
                <GoToPreviousPage />

                <CurrentPageInput />

                <span className="text-xs text-zinc-300">/</span>

                <NumberOfPages />

                <GoToNextPage />
              </div>

              <div className="h-6 w-px bg-zinc-600 shrink-0" />

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-black text-zinc-300">
                  Zoom
                </span>

                <div className="rounded-lg bg-zinc-700 px-1 py-1">
                  <ZoomOut>
                    {(props) => (
                      <button
                        onClick={props.onClick}
                        className="px-3 py-1 rounded-md bg-zinc-600 hover:bg-zinc-500 text-white text-sm font-black"
                        title="Zoom out"
                      >
                        -
                      </button>
                    )}
                  </ZoomOut>
                </div>

                <div className="min-w-[76px] text-center rounded-lg bg-zinc-700 px-2 py-1 text-xs font-black">
                  <Zoom />
                </div>

                <div className="rounded-lg bg-zinc-700 px-1 py-1">
                  <ZoomIn>
                    {(props) => (
                      <button
                        onClick={props.onClick}
                        className="px-3 py-1 rounded-md bg-zinc-600 hover:bg-zinc-500 text-white text-sm font-black"
                        title="Zoom in"
                      >
                        +
                      </button>
                    )}
                  </ZoomIn>
                </div>
              </div>

              <div className="h-6 w-px bg-zinc-600 shrink-0" />

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-black text-zinc-300">
                  Cari
                </span>

                <ShowSearchPopover />
              </div>

              <div className="ml-auto flex items-center gap-1 shrink-0">
                <EnterFullScreen />
              </div>
            </div>
          );
        }}
      </Toolbar>
    ),
  });

  if (!url) {
    return (
      <div className="w-full h-full flex items-center justify-center text-zinc-500">
        PDF belum tersedia
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-zinc-700">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer
          fileUrl={url}
          plugins={[defaultLayoutPluginInstance]}
          defaultScale={SpecialZoomLevel.PageFit}
        />
      </Worker>
    </div>
  );
}