//"../Navigation/Navigations.jsx";
import {useNavigate} from 'react-router-dom';

function useNavigations() {
  const navigate = useNavigate();

  return (page, params) => {
    switch (page) {
      case "Home":
        navigate('/home');
        break;
      case "Login":
        navigate('/');
        break;
      case "Findpwd":
        navigate('/find-pwd');
        break;
      case "Resetpwd":
        navigate('/reset-pwd');
        break;
      case "AdminPage":
        navigate('/admin-page');
        break;
      case "BoardMain":
        navigate('/board-main');
        break;
      case "BoardDetail":
        // params.postId를 통해 동적 경로 처리
        if (params?.postId) {
          navigate(`/board-detail/${params.postId}`);
        } else {
          console.error("Missing postId for BoardDetail navigation");
        }
        break;
      case "BoardCreate":
        navigate('/board-create');
        break;
      case "Mypage":
        navigate('/mypage');
        break;
      case "Inquire":
        navigate('/inquire');
        break;
      case "RoadsRecommend":
        navigate('/roads-recommend', {state: params});
        break;
      case "RoadsSearch":
        navigate('/roads-search');
        break;
      case "DevUser":
        navigate('/dev/user');
        break;
      default:
        navigate('/not-found');
        break;
    }
  };
}

export default useNavigations;
