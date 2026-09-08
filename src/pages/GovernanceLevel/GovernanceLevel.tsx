import { Navigate, useParams } from 'react-router-dom';

function GovernanceLevel() {
  const { nodeId } = useParams();
  return (
    <Navigate
      replace
      to="/basins/yellow-river"
      state={{ selectedNodeId: nodeId, openNodeDetail: true, openGovernance: true }}
    />
  );
}

export default GovernanceLevel;
