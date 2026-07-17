function YellowRiverMapLegend() {
  return (
    <div className="yellow-river-map__legend" aria-label="节点图例">
      <span><i className="yellow-river-map__legend-symbol yellow-river-map__legend-symbol--ecological" aria-hidden="true" />生态问题节点</span>
      <span><i className="yellow-river-map__legend-symbol yellow-river-map__legend-symbol--engineering" aria-hidden="true" />关键工程节点</span>
    </div>
  );
}

export default YellowRiverMapLegend;
