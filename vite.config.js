import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 빌드 출력 디렉토리 (기본값: 'dist')
    outDir: 'dist',

    // 빌드 시 소스맵 생성 여부 (CI/CD 환경에서는 디버깅을 위해 필요할 수 있음)
    sourcemap: true,

    // 번들링 최적화 설정
    rollupOptions: {
      // 예: 특정 라이브러리를 외부로 분리하고 싶을 때
      // external: ['react', 'react-dom'],
      // output: {
      //   globals: {
      //     react: 'React',
      //     'react-dom': 'ReactDOM',
      //   },
      // },
    },

    // 환경 변수에 따른 빌드 설정
    // 예를 들어, 특정 환경에서만 사용할 플러그인이나 설정이 있을 경우
    // terserOptions: {
    //   compress: {
    //     drop_console: process.env.NODE_ENV === 'production',
    //   },
    // },
  },
  // 기본 경로 설정 (필요에 따라 조정)
  // 예를 들어, 서브 디렉토리에 배포할 경우 base를 설정
  base: '/',
});
