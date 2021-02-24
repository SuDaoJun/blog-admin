import React, { useState, useEffect} from "react";
import { Form, Input, Button, message, Select, DatePicker, Space, Tabs, Table, Image, Tag, Modal} from 'antd';
import { connect } from 'react-redux'
import { StoreState } from '@/store/types'
import api from '@/api/index';
import { baseURL } from "@/api/axios";
import { constantData, currentSelectTime } from '@/utils/utils';

const ArticleList = (props: any) => {
  const history = props.history;
  const { confirm } = Modal;
  const { TabPane } = Tabs;
  let userInfo = props.stateData.userInfo;
  const { RangePicker } = DatePicker;
  const [searchForm] = Form.useForm();
  let [tagList, setTagList] = useState<any[]>([])
  let [tableData, setTableData] = useState<any[]>([])
  let [pageObj, setPageObj] = useState({
    pageSize: 10,
    total: 0,
    currentPage: 1
  })
  let [sortObj, setSortObj] = useState({
    sortBy: '',
    sortOrders: ''
  })
  let [articleStatus, setArticleStatus] = useState('1')

  let tableColumns = [
    {
      title: '文章标题',
      sorter: true,
      align: 'center' as 'center',
      dataIndex: 'title'
    },
    {
      title: '文章封面',
      align: 'center' as 'center',
      dataIndex: 'imgId',
      render: (text:string, record:any) => (
        <Image
          width={60}
          src={`${baseURL}/file/down?downId=${text}`}
          fallback="https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png"
        />
      ),
    },
    {
      title: '文章作者',
      align: 'center' as 'center',
      dataIndex: 'createUser',
      render: (text:string, record:any) => (
        <span>
          {record.createUser?record.createUser.name:'--'}
        </span>
      )
    },
    {
      title: '浏览量',
      sorter: true,
      align: 'center' as 'center',
      dataIndex: 'meta.viewTotal',
      render: (text:string, record:any) => (
        <span>
          {record.meta.viewTotal || 0}
        </span>
      )
    },
    {
      title: '点赞数',
      sorter: true,
      align: 'center' as 'center',
      dataIndex: 'meta.likeTotal',
      render: (text:string, record:any) => (
        <span>
          {record.meta.likeTotal || 0}
        </span>
      )
    },
    {
      title: '评论数',
      sorter: true,
      align: 'center' as 'center',
      dataIndex: 'meta.commentTotal',
      render: (text:string, record:any) => (
        <span>
          {record.meta.commentTotal || 0}
        </span>
      )
    },
    {
      title: '文章标签',
      width: 200,
      align: 'center' as 'center',
      dataIndex: 'tags',
      render: (text:string, record:any) => (
        <Space wrap>
          {
            record.tags.map((item:any)=>{
              return <Tag key={item._id} color={item.bgColor}>{item.name}</Tag>
            })
          }
          {
            record.tags.length === 0?<span>--</span>:''
          }
        </Space>
      )
    },
    {
      title: '创建时间',
      sorter: true,
      align: 'center' as 'center',
      dataIndex: 'createTime',
      render: (text:string, record:any) => (
        <span>
          {record.createTime?record.createTime.split(' ')[0]:'--'}
        </span>
      )
    },
    {
      title: '操作',
      width: 300,
      align: 'center' as 'center',
      dataIndex: 'operate',
      render: (text:string, record:any) => (
        <Space>
          {
            userInfo.roleId.functionList.includes('5e834f2afb69305aa091e825')?
            <Button className={articleStatus === '1'?'custom-button-info':'custom-button-success'} onClick={()=>updateStatus(record._id)}>{articleStatus === '1'?'转草稿':'发布'}</Button>:''
          }
          {
            userInfo.roleId.functionList.includes('5e99c1ccd1ba729a78b016b8')?
            <Button className='custom-button-warning' onClick={()=>commentData(record._id,record.title)}>评论</Button>:''
          }
          {
            userInfo.roleId.functionList.includes('5e834f2afb69305aa091e825')?
            <Button type='primary' onClick={()=>articleEdit(record._id,record.title)}>编辑</Button>:''
          }
          {
            userInfo.roleId.functionList.includes('5e834f31fb69305aa091e826')?
            <Button type="primary" danger onClick={()=>articleDel(record._id)}>删除</Button>:''
          }
        </Space>
      )
    },
  ]
  // 修改文章状态
  const updateStatus = (id:string)=>{
    confirm({
      title: '提示',
      content: '此操作将修改文章状态, 是否继续?',
      closable: true,
      onOk() {
        return new Promise((resolve, reject) => {
          api.article.articleUpdate({
            id,
            status: articleStatus === '1'?'0':'1'
          }).then((res)=>{
            let code = res.data.code;
            resolve('')
            if(code === constantData.reqSuccess){
              getDataList();
              message.success('文章修改状态成功');
            }else{
              message.warning('文章修改状态失败');
            }
          })
        }).catch(() => {});
      }
    });
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
  // 查询数据
  const resetSearch = ()=>{
    searchForm.resetFields();
    getDataList()
  }
  // 文章操作
  const articleAdd = ()=>{
    history.push('/article/articleAdd')
  }
  const articleEdit = (id:string, title:string)=>{
    history.push({
      pathname: '/article/edit',
      state: {
        articleId: id,
        articleTitle: title
      }
    })
  }
  const articleDel = (id:string)=>{
    confirm({
      title: '提示',
      content: '此操作将永久删除该文章及其评论, 是否继续?',
      closable: true,
      okType: 'danger',
      onOk() {
        return new Promise((resolve, reject) => {
          api.article.articleDel(id).then((res)=>{
            let code = res.data.code;
            resolve('')
            if(code === constantData.reqSuccess){
              getDataList();
              message.success('文章删除成功');
            }else{
              message.warning('文章删除失败');
            }
          })
        }).catch(() => {});
      }
    });
  }
  // 文章评论
  const commentData = (id:string, title:string)=>{
    history.push({
      pathname: '/article/comment',
      state: {
        articleId: id,
        articleTitle: title
      }
    })
  }
  // 获取列表数据
  const getDataList = (page?: Boolean)=>{
    pageObj.currentPage = page === true?pageObj.currentPage:1;
    let formModel = searchForm.getFieldsValue();
    let sortOrders = '';
    if(sortObj.sortOrders){
      if(sortObj.sortOrders === 'ascend'){
        sortOrders = '1';
      }else{
        sortOrders = '0';
      }
    }
    api.article.articleList({
      currentPage: pageObj.currentPage,
      pageSize: pageObj.pageSize,
      title: formModel.title,
      tags: formModel.tags,
      status: articleStatus,
      createTime: formModel.createTime?currentSelectTime(formModel.createTime[0])+','+currentSelectTime(formModel.createTime[1]):null,
      sortBy: sortObj.sortBy,
      sortOrders
    }).then(res =>{
      let code = res.data.code
      if(code === constantData.reqSuccess){
        pageObj.total = res.data.data.count;
        setPageObj({...pageObj})
        setTableData([...res.data.data.data])
      }else{
        message.warning('获取文章列表失败');
      }
    })
  }
  // table排序分页变化
  const tableChange = (pagination:any, filters:any, sorter:any) =>{
    if(pageObj.currentPage !== pagination.current || pageObj.pageSize !== pagination.pageSize){
      pageObj.currentPage = pagination.current;
      pageObj.pageSize = pagination.pageSize;
      setPageObj({...pageObj})
      getDataList(true)
    }
    if(JSON.stringify(sorter) !== '{}'){
      if(sorter.field !== sortObj.sortBy || sorter.order !== sortObj.sortOrders){
        sortObj.sortBy = sorter.order?sorter.field:'';
        sortObj.sortOrders = sorter.order?sorter.order:'';
        setSortObj({...sortObj})
        getDataList()
      }
    }
  }
  // tab切换
  const tabsChange = (key:string)=>{
    articleStatus = key
    setArticleStatus(key)
    getDataList()
  }
  useEffect(() => {
    getTagsList()
    getDataList()
  }, []);

  return <div className='article-wrapper'>
     <h2 className='content-title'>文章列表</h2>
     <div className="box-table">
      <Form
         layout='inline'
         form={searchForm}
       >
         <Form.Item label="文章标题" name='title' className='margin-bottom-20'>
            <Input 
             maxLength={20} 
             allowClear={true} 
             placeholder="文章标题" 
           />
         </Form.Item>
         <Form.Item label="文章标签" name='tags' className='margin-bottom-20'>
            <Select allowClear={true} style={{width: '160px'}} placeholder="文章标签">
              {
                tagList.map(item=>{
                  return <Select.Option key={item._id} value={item._id}>{item.name}</Select.Option>
                })
              }
            </Select>
         </Form.Item>
         <Form.Item label="创建时间" name='createTime' className='margin-bottom-20'>
            <RangePicker />
         </Form.Item>
         <Form.Item className='margin-left-30 margin-bottom-20'>
            <Space size='large'>
              <Button type="primary" onClick={()=>getDataList()}>查询</Button>
              {
                userInfo.roleId.functionList.includes('5e834f23fb69305aa091e824')?<Button type="primary" onClick={articleAdd}>新增</Button>:''
              }
              <Button onClick={resetSearch}>重置</Button>
            </Space>
         </Form.Item>
       </Form>
       <Tabs defaultActiveKey={articleStatus} size='large' onChange={tabsChange}>
         <TabPane tab="已发布" key="1">
         </TabPane>
         <TabPane tab="草稿" key="0">
         </TabPane>
       </Tabs>
       <div className="table-show">
       <Table rowKey='_id' columns={tableColumns} dataSource={tableData} pagination={{
         total: pageObj.total,
         showTotal: ()=>`共 ${pageObj.total} 条`,
         current: pageObj.currentPage,
         pageSize: pageObj.pageSize,
        }} onChange={tableChange} />
       </div>
     </div>
  </div>;
};

const mapStateToProps = (state: StoreState) => ({
  stateData: state
})

export default connect(mapStateToProps)(ArticleList)
