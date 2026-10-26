// 굴절 지도: 빨강은 가로, 초록은 세로로 얼마나 밀지 정한다(128이 그대로, 0·255로 갈수록 크게 민다).
// 가운데는 흐린 중립색(128, 128)으로 덮어서 가장자리만 휘고 가운데는 그대로 보이게 한다.
// 유리 크기에 맞춰 늘어나도록 preserveAspectRatio='none'으로 둔다.
const DISPLACEMENT_MAP_SVG = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'>
<defs>
<linearGradient id='x' x1='0' x2='1' y1='0' y2='0'><stop offset='0' stop-color='#000'/><stop offset='1' stop-color='#f00'/></linearGradient>
<linearGradient id='y' x1='0' x2='0' y1='0' y2='1'><stop offset='0' stop-color='#000'/><stop offset='1' stop-color='#0f0'/></linearGradient>
<filter id='soft'><feGaussianBlur stdDeviation='5'/></filter>
</defs>
<rect width='100' height='100' fill='url(#x)'/>
<rect width='100' height='100' fill='url(#y)' style='mix-blend-mode:screen'/>
<rect x='12' y='12' width='76' height='76' rx='12' fill='#808000' filter='url(#soft)'/>
</svg>`;

const DISPLACEMENT_MAP_URL = `data:image/svg+xml,${encodeURIComponent(DISPLACEMENT_MAP_SVG)}`;

export const LIQUID_GLASS_FILTER_ID = 'liquid-glass-refraction';

// Apple Liquid Glass처럼 유리 가장자리에서 뒤 화면이 렌즈처럼 휘어 보이게 하는 SVG 필터.
// globals.css의 glass 유틸리티가 backdrop-filter: url(#liquid-glass-refraction)로 가져다 쓴다.
// backdrop-filter에서 SVG 필터는 Chrome 계열만 그려서, 다른 브라우저에서는 쓰지 않는다.
export default function LiquidGlassFilter() {
  return (
    <svg aria-hidden className='pointer-events-none absolute h-0 w-0'>
      <filter
        id={LIQUID_GLASS_FILTER_ID}
        x='0'
        y='0'
        width='1'
        height='1'
        primitiveUnits='objectBoundingBox'
        colorInterpolationFilters='sRGB'
      >
        <feImage
          href={DISPLACEMENT_MAP_URL}
          x='0'
          y='0'
          width='1'
          height='1'
          preserveAspectRatio='none'
          result='map'
        />
        {/* 음수라서 가장자리가 바깥이 아닌 안쪽 화면을 끌어와, 볼록한 유리처럼 보인다 */}
        <feDisplacementMap
          in='SourceGraphic'
          in2='map'
          scale='-0.12'
          xChannelSelector='R'
          yChannelSelector='G'
        />
      </filter>
    </svg>
  );
}
