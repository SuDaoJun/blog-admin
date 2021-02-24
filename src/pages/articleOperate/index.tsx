import React, { useState, useEffect, useRef } from "react";
import { Form, Input, Button, Select, message, Upload, Image, Space, Progress, Modal, Radio} from 'antd';
import { UploadOutlined  } from '@ant-design/icons';
import api from '@/api/index';
import { baseURL } from "@/api/axios";
import { constantData } from '@/utils/utils';
import { FormValidate } from '@/utils/format';
import Wangeditor from 'wangeditor'
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'
import Editor from 'for-editor'
import "./index.scss";
let marked = require('marked')

const ArticleOperate = (props: any) => {
  const history = props.history;
  const { TextArea } = Input;
  const [articleForm] = Form.useForm();
  let toolbar = useRef<HTMLDivElement>(null);
  let editor = useRef<HTMLDivElement>(null);
  let state = props.location.state
  let [type, setType] = useState('add')
  let [articleTitle, setArticleTitle] = useState('')
  let [sourceId, setSourceId] = useState('')
  let [selectSourceId, setSelectSourceId] = useState('')
  let [tagList, setTagList] = useState<any[]>([])
  let [imgList, setImgList] = useState<any[]>([])
  let [editorData, setEditorData] = useState<any>({})
  let [id, setId] = useState('')
  let [percent, setPercent] = useState(0);
  let [contentType, setContentType] = useState('0');
  let [markContent, setMarkContent] = useState('');
  let [htmlContent, setHtmlContent] = useState('');
  let [loadObj, setLoadObj] = useState({
    draftLoad: false,
    releaseLoad: false
  });
  let [dialogVisible, setDialogVisible] = useState(false);
  
  useEffect(() => {
    seteditor()
    getTagsList()
    getImgList()
    if(state){
      setType('edit')
      setId(state.articleId)
      setArticleTitle(state.articleTitle)
      getDataDetail(state.articleId)
    }else{
      articleForm.setFieldsValue({ contentType: '0' })
    }
  }, []);
  // 文章详情
  const getDataDetail = (articleId:string)=>{
    api.article.articleDetail({
      id:articleId
    }).then(res=>{
      let code = res.data.code
      if(code === constantData.reqSuccess){
        let data = res.data.data
        if(data.imgId){
          setSourceId(data.imgId)
        }
        let tags:any[] = []
        data.tags.forEach((item:any)=>{
          tags.push(item._id)
        })
        articleForm.setFieldsValue({ title: data.title })
        articleForm.setFieldsValue({ description: data.description })
        articleForm.setFieldsValue({ tags: tags })
        articleForm.setFieldsValue({ contentType: data.contentType })
        setContentType(data.contentType)
        if(data.contentType === '0'){
          setHtmlContent(data.content)
          editorData.txt.html(data.content)
          setEditorData({...editorData})
        }else{
          setMarkContent(data.markContent)
        }
      }else{
        message.warning('获取文章详情失败');
      }
    })
  }
  // 初始化富文本编辑器
  const seteditor = ()=>{
    editorData = new Wangeditor(toolbar.current, editor.current)
    editorData.config.uploadImgShowBase64 = true; // // base 64 存储图片
    editorData.config.uploadImgHeaders = {}; // 自定义 header
    editorData.config.uploadFileName = "file"; // 后端接受上传文件的参数名
    editorData.config.uploadImgMaxSize = 2 * 1024 * 1024; // 将图片大小限制为 2M
    editorData.config.uploadImgMaxLength = 6; // 限制一次最多上传 6 张图片
    editorData.config.uploadImgTimeout = 60 * 60 * 1000; // 设置超时时间
    editorData.config.zIndex = 2; // 编辑区域和菜单的z-index
    // 配置菜单
    editorData.config.menus = [
      "head", // 标题
      "bold", // 粗体
      "fontSize", // 字号
      "fontName", // 字体
      "italic", // 斜体
      "underline", // 下划线
      "strikeThrough", // 删除线
      "foreColor", // 文字颜色
      "backColor", // 背景颜色
      "link", // 插入链接
      "list", // 列表
      "justify", // 对齐方式
      "quote", // 引用
      "emoticon", // 表情
      "image", // 插入图片
      "table", // 表格
      "video", // 插入视频
      "code", // 插入代码
      "undo", // 撤销
      "redo" // 重复
    ];
    editorData.config.onchange = (html:any) => {
      setHtmlContent(editorData.txt.html())
    };
    editorData.highlight = hljs
    // 创建富文本编辑器
    editorData.create();
    setEditorData({...editorData})
  }
  // 获取文章标签列表
  const getTagsList = ()=>{
    api.article.tagList({
      currentPage: '1',
      pageSize: '99'
    }).then(res =>{
      let code = res.data.code
      if(code === constantData.reqSuccess){
        let list = res.data.data.data
        setTagList([...list])
      }else{
        message.warning('获取标签列表失败');
      }
    })
  }
  const getImgList = ()=>{
    api.article.articleImgStatistics({
      num: 30
    }).then(res =>{
      let code = res.data.code
      if(code === constantData.reqSuccess){
        let list:any[] = res.data.data;
        list = list.filter((item:any)=>{
          return item.imgId
        })
        setImgList([...list])
      }else{
        message.warning('获取图片列表失败');
      }
    })
  }
  
  const imgUploadProps = {
    accept: 'image/*',
    showUploadList: false,
    transformFile: (file: any)=>{
      return file
    },
    beforeUpload: (file: any) => {
      if(file.size >  1048576){
        let sizeLimit = 1048576/1024/1024
        message.warning(`大小限制在${sizeLimit}Mb以内`)
        return false
      }
      setPercent(0)
      let fd = new FormData()
      fd.append('file', file)
      api.upload.uploadFile(fd,(upload:any)=>{
        let complete = (upload.loaded / upload.total * 100 | 0)
        setPercent(complete)
        if(complete === 100){
          setTimeout(()=>{
            setPercent(0)
          },1000)
        }
      }).then((res) => {
        let code = res.data.code
        if(code === constantData.reqSuccess){
          let fileData = res.data.data
          setSourceId(fileData.sourceId)
        }else{
          setPercent(0)
          message.warning('文件上传失败');
        }
      })
      return false;
    }
  };
  // 封面选择
  const dialogOpen = ()=>{
    setSelectSourceId(sourceId)
    setDialogVisible(true)
  }
  const confirSelect = ()=>{
    if(selectSourceId){
      setSourceId(selectSourceId)
      setDialogVisible(false)
    }else{
      message.warning('请选择一个封面图片');
    }
  }
  // 内容类型
  const typeChange = (e:any)=>{
    let value = e.target.value
    setContentType(value)
  }
  const markChange = (value:any)=>{
    setMarkContent(value)
  }
  const markdownAddImg = (file:any)=>{
    if(file.size >  1048576){
      let sizeLimit = 1048576/1024/1024
      message.warning(`文件大小限制在${sizeLimit}Mb以内`)
      return false
    }
    let fd = new FormData()
    fd.append('file', file)
    api.upload.uploadFile(fd,(upload:any)=>{

    }).then((res) => {
      let code = res.data.code
      if(code === constantData.reqSuccess){
        let fileData = res.data.data
        setMarkContent(markContent + `![${file.name}](${fileData.url})`)
      }else{
        message.warning('文件上传失败');
      }
    })
  }
  // 提交文章
  const  articleAdd = (status:string)=>{
    articleForm.validateFields().then((values)=>{
      let contentData = contentType == '1'?marked(markContent):htmlContent
      if(contentData){
        status === '0'?loadObj.draftLoad = true:loadObj.releaseLoad = true;
        setLoadObj({...loadObj})
        if(type === 'add'){
          api.article.articleAdd({
            title: values.title,
            description: values.description,
            content: contentData,
            markContent: contentType === '1'?markContent:'',
            contentType: contentType,
            imgId: sourceId || null,
            status,
            tags: values.tags.join(',')
          }).then((res)=>{
            let code = res.data.code
            status == '0'?loadObj.draftLoad = false:loadObj.releaseLoad = false
            setLoadObj({...loadObj})
            if(code === constantData.reqSuccess){
              message.success('文章新增成功')
              history.push('/article/articleList')
            }else if(code === constantData.dataAlready){
              articleForm.setFieldsValue({ title: '' })
              message.warning('文章标题已存在')
            }else{
              message.warning('文章新增失败')
            }
          })
        }else{
          api.article.articleUpdate({
            id,
            title: values.title,
            description: values.description,
            contentType: values.contentType,
            content: contentData,
            markContent: contentType === '1'?markContent:'',
            imgId: sourceId || null,
            status,
            tags: values.tags.join(',')
          }).then((res)=>{
            let code = res.data.code
            status == '0'?loadObj.draftLoad = false:loadObj.releaseLoad = false
            setLoadObj({...loadObj})
            if(code === constantData.reqSuccess){
              message.success('文章编辑成功')
              history.push('/article/articleList')
            }else if(code === constantData.dataAlready){
              articleForm.setFieldsValue({ title: '' })
              message.warning('文章标题已存在')
            }else{
              message.warning('文章编辑失败')
            }
          })
        }
      }else{
        message.warning("文章内容不为空")
      }
    }).catch(()=>{});
  }

  return <div className='article-operate'>
    <h2 className='content-title'>{type === 'add'?"创建文章":(articleTitle?'编辑文章——'+articleTitle:'编辑文章')}</h2>
    <div className="box-table">
      <Form
        form={articleForm}
        colon={false}
        requiredMark={false}
        validateTrigger='onBlur'
        style={{width: '500px'}}
        scrollToFirstError
      >
        <Form.Item
          name="title"
          label="文章标题"
          rules={FormValidate({name: '文章标题'})}
        >
          <Input 
            maxLength={20} 
            allowClear={true} 
            placeholder="文章标题" 
          />
        </Form.Item>
        <Form.Item
          name="description"
          label="文章描述"
          rules={FormValidate({name: '文章描述'})}
        >
           <TextArea rows={2} maxLength={100} allowClear={true} placeholder="文章描述" />
        </Form.Item>
        <Form.Item
          name="tags"
          label="文章标签"
          validateTrigger='onChange'
          rules={FormValidate({type: 'array',name: '文章标签'})}
        >
           <Select allowClear={true}  placeholder="文章标签" mode="multiple">
             {
               tagList.map(item=>{
                 return <Select.Option key={item._id} value={item._id}>{item.name}</Select.Option>
               })
             }
           </Select>
        </Form.Item>
        <Form.Item
          name="upload"
          label="文章封面"
        >
          <div className="upload-box">
            <Upload  {...imgUploadProps}>
              {sourceId?<Image
                width={120}
                height={120}
                preview={false}
                style={{borderRadius: '4px'}}
                src={`${baseURL}/file/down?downId=${sourceId}`}
              />:<Button type="primary" icon={<UploadOutlined />}>上传</Button>}
              {
                percent === 0?'': <Progress
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                  percent={percent}
                />
              }
            </Upload>
            <div className="select-txt" onClick={dialogOpen}>封面选择</div>
          </div>
        </Form.Item>
        <Form.Item name="contentType" label="文章类型">
          <Radio.Group onChange={typeChange}>
            <Radio value="0">富文本编辑</Radio>
            <Radio value="1">markdown编辑</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
      <div className="box-content">
        <span className='content-info'>文章内容</span>
        <div className="editor" style={{display: contentType === '0'?'block':'none'}}>
          <div ref={toolbar} className="toolbar">
          </div>
          <div ref={editor} className="text">
          </div>
        </div>
        {
          contentType === '1'?<Editor 
            value={markContent}
            placeholder='请输入...'
            preview={true}
            subfield={true}
            height='542px'
            style={{width: '100%'}}
            addImg={markdownAddImg} 
            onChange={markChange} 
          />:''
        }
      </div>
      <div className="box-btn">
        <Space size='large'>
          <Button loading={loadObj.draftLoad} onClick={()=>{articleAdd('0')}}>存草稿</Button>
          <Button type="primary" loading={loadObj.releaseLoad}  onClick={()=>{articleAdd('1')}}>发布</Button>
        </Space>
      </div>
    </div>
    <Modal title="封面选择" width={710} visible={dialogVisible} onOk={confirSelect} onCancel={()=>{setDialogVisible(false)}}>
      <div className="dialog-list">
        {
          imgList.map((item:any)=>{
            return <div className={selectSourceId == item.imgId?'list-item item-active':'list-item'} key={item._id} onClick={()=>{setSelectSourceId(item.imgId)}}>
              <Image
                width={100}
                height={100}
                style={{borderRadius: '4px'}}
                preview={false}
                src={`${baseURL}/file/down?downId=${item.imgId}`}
              />
            </div>
          })
        }
      </div>
    </Modal>
  </div>;
};

export default ArticleOperate;
