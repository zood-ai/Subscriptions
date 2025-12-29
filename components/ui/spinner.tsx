export default function Spinner() {
  const loaderStyle = {
    width: '45px',
    aspectRatio: '.75',
    '--c': `no-repeat linear-gradient(#7272f6 0 0)`,
    background: `
      var(--c) 0%   50%,
      var(--c) 50%  50%,
      var(--c) 100% 50%
    `,
    animation: 'l7 1s infinite linear alternate',
  };

  const keyframesStyle = `
    @keyframes l7 {
      0%  {background-size: 20% 50% ,20% 50% ,20% 50% }
      20% {background-size: 20% 20% ,20% 50% ,20% 50% }
      40% {background-size: 20% 100%,20% 20% ,20% 50% }
      60% {background-size: 20% 50% ,20% 100%,20% 20% }
      80% {background-size: 20% 50% ,20% 50% ,20% 100%}
      100%{background-size: 20% 50% ,20% 50% ,20% 50% }
    }
  `;

  return (
    <>
      <style>{keyframesStyle}</style>
      <div style={loaderStyle} />
    </>
  );
}
