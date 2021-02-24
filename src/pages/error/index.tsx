import React from "react";
import "./index.scss";
import imgUrl1 from '@/assets/img/404.png';
import imgUrl2 from '@/assets/img/404_cloud.png';

const Error404 = (props: any) => {
  return <div className="error-show">
    <div className="wscn-http404-container">
      <div className="wscn-http404">
        <div className="pic-404">
          <img  className="pic-404__parent right" src={imgUrl1} alt="404" />
          <img  className="pic-404__child left" src={imgUrl2} alt="404" />
          <img  className="pic-404__child mid" src={imgUrl2} alt="404" />
          <img  className="pic-404__child right" src={imgUrl2} alt="404" />
        </div>
        <div className="bullshit">
          <div className="bullshit__headline">404</div>
          <div className="bullshit__info">抱歉，你访问的页面不存在</div>
          <a
            href="/"
            className="bullshit__return-home"
          >返回首页</a>
        </div>
      </div>
    </div>
  </div>;
};

export default Error404;
