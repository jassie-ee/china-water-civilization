interface ChinaOutlineLayerProps {
  assetHref: string | null;
}

/** 仅承载经地图核验通过的国家版图资产，不混入流域或交互元素。 */
function ChinaOutlineLayer({ assetHref }: ChinaOutlineLayerProps) {
  if (assetHref === null) {
    return null;
  }

  return <image className="china-outline-layer" href={assetHref} aria-hidden="true" />;
}

export default ChinaOutlineLayer;
