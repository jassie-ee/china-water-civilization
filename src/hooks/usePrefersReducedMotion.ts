import { useEffect, useState } from 'react';

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ));

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handlePreferenceChange = () => setPrefersReducedMotion(motionQuery.matches);

    motionQuery.addEventListener('change', handlePreferenceChange);
    return () => motionQuery.removeEventListener('change', handlePreferenceChange);
  }, []);

  return prefersReducedMotion;
}

export default usePrefersReducedMotion;
