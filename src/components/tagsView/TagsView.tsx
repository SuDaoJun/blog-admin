import React,{useState, useEffect} from 'react'
import { CloseOutlined,} from '@ant-design/icons';
import { useHistory } from 'react-router-dom'
import { RoutersArr } from "@/router/route";
import './index.scss'

const TagsView = (data: any) => {
  const history = useHistory();
  let [tagsArr, setTagsArr] = useState<any[]>([{
    path: '/index',
    name: '首页',
    affix: true
  }]);

  
  let location = data.props.location;
  useEffect(()=>{
    let pathName = location.pathname;
    let newTagsArr = tagsArr;
    let filterArr = newTagsArr.filter(item=>item.path === pathName);
    if(filterArr.length === 0){
      RoutersArr.forEach(item=>{
        if(item.path === pathName){
          newTagsArr.push({
            path: item.path,
            name: item.meta.title
          })
        }
      })
      setTagsArr(newTagsArr)
    }
  },[location.pathname])

  // 关闭当前tag
  const closeTag = (e:any, path:string)=>{
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    tagsArr = tagsArr.filter(item=>item.path !== path);
    setTagsArr(tagsArr)
    history.replace(tagsArr[tagsArr.length-1].path)
  }
  // 选择当前tag
  const selectTag = (path:string)=>{
    history.replace(path)
  }

  return (
    <div className="tags-view-container">
      <div className="tags-view-wrapper scroll-container">
        {
          tagsArr.map(item=>{
            return <div className={item.path === location.pathname?"tags-view-item active":"tags-view-item"} key={item.name} onClick={()=>selectTag(item.path)}>
              {item.name}
              {item.affix?'':<CloseOutlined className='tags-icon-close' onClick={(e)=>closeTag(e,item.path)} />}
            </div>
          })
        }
      </div>
    </div>
  )
}

export default TagsView