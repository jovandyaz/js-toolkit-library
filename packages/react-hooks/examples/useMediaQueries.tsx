import {
  useBreakpointUp,
  useBreakpointDown,
  useBreakpointBetween,
  useMediaQuery,
  useIsMobile,
  useIsDesktop,
  Breakpoint,
} from '@hooks/media';

const MediaQueriesExample = () => {
  const isDesktop = useBreakpointUp('md');
  const isMobile = useBreakpointDown('sm');
  const isTablet = useBreakpointBetween('sm', 'lg');

  const renderByBreakpoint = () => {
    if (isMobile) {
      return <MobileView />;
    } else if (isTablet) {
      return <TabletView />;
    } else {
      return <DesktopView />;
    }
  };

  const MobileView = () => (
    <div style={{ padding: '10px', backgroundColor: '#ffcccc' }}>
      <h3>Mobile View</h3>
      <p>This component is shown on mobile devices (less than 600px width).</p>
    </div>
  );

  const TabletView = () => (
    <div style={{ padding: '20px', backgroundColor: '#ccffcc' }}>
      <h3>Tablet View</h3>
      <p>
        This component is shown on tablets (between 600px and 1280px width).
      </p>
    </div>
  );

  const DesktopView = () => (
    <div style={{ padding: '30px', backgroundColor: '#ccccff' }}>
      <h3>Desktop View</h3>
      <p>This component is shown on desktops (at least 960px width).</p>
    </div>
  );

  const getResponsiveStyles = () => {
    if (isMobile) {
      return { fontSize: '14px', padding: '8px' };
    } else if (isTablet) {
      return { fontSize: '16px', padding: '16px' };
    } else {
      return { fontSize: '18px', padding: '24px' };
    }
  };

  const BreakpointDemo = () => {
    const breakpoints: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl'];

    return (
      <div>
        <h3>Breakpoint Status</h3>
        <ul>
          {breakpoints.map((breakpoint) => (
            <li key={breakpoint}>
              <strong>{breakpoint} up:</strong>{' '}
              {useBreakpointUp(breakpoint) ? 'Yes' : 'No'}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const CustomMediaQueryDemo = () => {
    const isHighResolution = useMediaQuery('(min-resolution: 2dppx)');
    const hasHover = useMediaQuery('(hover: hover)');
    const preferReducedMotion = useMediaQuery(
      '(prefers-reduced-motion: reduce)'
    );

    return (
      <div
        style={{
          marginBottom: '20px',
          border: '1px solid #ccc',
          padding: '15px',
          borderRadius: '5px',
        }}
      >
        <h3>Custom Media Query Examples</h3>
        <ul>
          <li>
            <strong>High Resolution Display:</strong>{' '}
            {isHighResolution ? 'Yes' : 'No'}
          </li>
          <li>
            <strong>Hover Capability:</strong> {hasHover ? 'Yes' : 'No'}
          </li>
          <li>
            <strong>Prefers Reduced Motion:</strong>{' '}
            {preferReducedMotion ? 'Yes' : 'No'}
          </li>
        </ul>
      </div>
    );
  };

  return (
    <div style={getResponsiveStyles()}>
      <h1>useMediaQueries Examples</h1>

      <div style={{ marginBottom: '20px' }}>
        <h2>Current Viewport Status</h2>
        <p>Is Mobile (xs to sm): {isMobile ? 'Yes' : 'No'}</p>
        <p>Is Tablet (sm to lg): {isTablet ? 'Yes' : 'No'}</p>
        <p>Is Desktop (md up): {isDesktop ? 'Yes' : 'No'}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Conditional Rendering</h2>
        {renderByBreakpoint()}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>New Media Hooks Demo</h2>
        <p>Is Mobile Device (below 600px): {useIsMobile() ? 'Yes' : 'No'}</p>
        <p>
          Is Desktop Device (960px and above): {useIsDesktop() ? 'Yes' : 'No'}
        </p>
        <p>Is Print Mode: {useMediaQuery('print') ? 'Yes' : 'No'}</p>
        <p>
          Is Dark Mode:{' '}
          {useMediaQuery('(prefers-color-scheme: dark)') ? 'Yes' : 'No'}
        </p>
        <p>
          Is Landscape Orientation:{' '}
          {useMediaQuery('(orientation: landscape)') ? 'Yes' : 'No'}
        </p>
      </div>

      <CustomMediaQueryDemo />

      <BreakpointDemo />
    </div>
  );
};

export default MediaQueriesExample;
