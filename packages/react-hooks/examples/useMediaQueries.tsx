import {
  useBreakpointUp,
  useBreakpointDown,
  useBreakpointBetween,
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

  return (
    <div style={getResponsiveStyles()}>
      <h1>useMediaQueries Examples</h1>

      <div style={{ marginBottom: '20px' }}>
        <h2>Current Viewport Status</h2>
        <p>Is Mobile (xs down): {isMobile ? 'Yes' : 'No'}</p>
        <p>Is Tablet (sm-lg): {isTablet ? 'Yes' : 'No'}</p>
        <p>Is Desktop (md up): {isDesktop ? 'Yes' : 'No'}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Conditional Rendering</h2>
        {renderByBreakpoint()}
      </div>

      <BreakpointDemo />
    </div>
  );
};

export default MediaQueriesExample;
