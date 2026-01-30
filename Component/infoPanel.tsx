import type { PointApiResponse } from "../app/api/point/type";

type Props = {
  pointData: PointApiResponse | null;
  loading: boolean;
};

export default function InfoPanel({ pointData, loading }: Props) {
  return (
    <div className="absolute bottom-4 left-4 z-20 w-[320px] rounded bg-white p-3 shadow">
      <div className="font-semibold">Info</div>

      {loading && <div className="text-sm opacity-70">Loading…</div>}

      {!pointData && !loading && (
        <div className="text-sm opacity-70">Click on the map to inspect a point.</div>
      )}

      {pointData && (
        <div className="mt-2 space-y-2 text-sm">
          <div>
            <span className="font-medium">Coords:</span>{" "}
            {pointData.point.lng.toFixed(5)}, {pointData.point.lat.toFixed(5)}
          </div>

          <div>
            <span className="font-medium">Temperature:</span>{" "}
            {pointData.meteo.temperature ?? "—"} °C
            {pointData.meteo.time ? (
              <span className="opacity-70"> ({new Date(pointData.meteo.time).toLocaleString()})</span>
            ) : null}
          </div>

          <div>
            <span className="font-medium">Noise:</span>{" "}
            {(pointData.noise.level * 100).toFixed(0)}% ({pointData.noise.label})
          </div>

          <div>
            <span className="font-medium">Stress:</span>{" "}
            {(pointData.stress.index * 100).toFixed(0)}% ({pointData.stress.label})
          </div>
        </div>
      )}
    </div>
  );
}
