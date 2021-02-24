import React, { useState, useEffect} from "react";
import { Form, Input, Button, message, Select, DatePicker, Space, Table, Modal, Switch, Empty, Avatar} from 'antd';
import { MessageOutlined, UserOutlined, ClockCircleOutlined, CloseCircleOutlined, CheckCircleOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';
import { connect } from 'react-redux'
import { StoreState } from '@/store/types'
import api from '@/api/index';
import { baseURL } from "@/api/axios";
import { constantData, currentSelectTime } from '@/utils/utils';
import "./index.scss";

const ArticleListComment = (props: any) => {
  const { TextArea } = Input;
  const state = props.location.state
  const { confirm } = Modal;
  let userInfo = props.stateData.userInfo;
  const { RangePicker } = DatePicker;
  const [searchForm] = Form.useForm();
  let [articleTitle, setArticleTitle] = useState('')
  let [articleId, setArticleId] = useState('')
  let [commentValue, setCommentValue] = useState('')
  let [commentObj, setCommentObj] = useState<any>({
    modal: false,
    loading: false,
    type: 'add',
    title: '',
    content: '',
    selectRow: {},
  })
  let [replayCommentObj, setReplayCommentObj] = useState<any>({
    modal: false,
    loading: false,
    index: 0,
    replyIndex: 0,
    replyItem: {},
    selectRow: {}
  })
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

  let tableColumns = [
    {
      title: '评论用户',
      align: 'center' as 'center',
      dataIndex: 'createUser',
      render: (text:string, record:any) => (
        <span>
          {record.createUser?record.createUser.name:'--'}
        </span>
      )
    },
    {
      title: '评论内容',
      align: 'center' as 'center',
      dataIndex: 'content',
      ellipsis: true
    },
    {
      title: '评论回复',
      align: 'center' as 'center',
      dataIndex: 'replyCommentList',
      render: (text:string, record:any, index:number) => (
        <div className='flex-wrap' style={{color: '#409EFF', fontSize: '16px', cursor: 'pointer'}} onClick={()=>{commentList(record,index)}}>
          <MessageOutlined />
          <span className='margin-left-10'>{record.replyCommentList.length}</span>
        </div>
      )
    },
    {
      title: '创建时间',
      sorter: true,
      align: 'center' as 'center',
      dataIndex: 'createTime'
    },
    {
      title: '评论状态',
      align: 'center' as 'center',
      dataIndex: 'status',
      render: (text:string, record:any) => (
        <Switch checkedChildren="启用" unCheckedChildren="禁用" checked={text === '1'} onChange={()=>{statusChange(record)}} />
      )
    },
    {
      title: '操作',
      width: 220,
      align: 'center' as 'center',
      dataIndex: 'operate',
      render: (text:string, record:any) => (
          <Space>
            {
              userInfo.roleId.functionList.includes('5e834f77fb69305aa091e82b')?
              <Button type='primary' onClick={()=>editComment(record)}>编辑</Button>:''
            }
            {
              userInfo.roleId.functionList.includes('5e834f61fb69305aa091e829')?
              <Button type="primary" danger onClick={()=>commentDel(record._id)}>删除</Button>:''
            }
            {
              userInfo.roleId.functionList.includes('5e834f77fb69305aa091e82b')?
              <Button className={record.isTop?'custom-button-warning':'custom-button-info'}  onClick={()=>commentTop(record)}>置顶</Button>:''
            }
          </Space>
      )
    }
  ]

  useEffect(() => {
    if(state){
      setArticleId(state.articleId)
      setArticleTitle(state.articleTitle)
    }
  }, []);

  useEffect(() => {
    getDataList()
  }, [articleId]);

  
  // 获取列表数据
  const getDataList = (page?: Boolean)=>{
    if(!articleId){
      return
    }
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
    api.article.commentList({
      currentPage: pageObj.currentPage,
      pageSize: pageObj.pageSize,
      articleId,
      status: formModel.status,
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
  // 状态修改
  const statusChange = (row:any)=>{
    if(userInfo.roleId.functionList.includes('5e834f77fb69305aa091e82b')){
      let info = row.status === "1" ? "禁用" : "启用"
      confirm({
        title: '提示',
        content: `此操作将${info}评论, 是否继续?`,
        closable: true,
        onOk() {
          return new Promise((resolve, reject) => {
            api.article.commentUpdate({
              commentId: row._id,
              status: row.status === '1'?'0':'1'
            }).then((res)=>{
              let code = res.data.code;
              resolve('')
              if(code === constantData.reqSuccess){
                getDataList()
              }else{
                message.warning('评论状态修改失败');
              }
            })
          }).catch(() => {});
        }
      });
    }else{
      message.warning('暂无权限修改状态')
    }
  }
  // 评论内容变化
  const textChange = (e:any)=>{
    setCommentValue(e.target.value)
  }
  // 评论增删改
  const commentAdd = ()=>{
    commentObj.title = '新增评论';
    commentObj.content = '请输入评论内容:';
    commentObj.type = 'add';
    commentObj.modal = true;
    setCommentValue('')
    setCommentObj({...commentObj})
  }
  const editComment = (row:any)=>{
    commentObj.title = '编辑评论';
    commentObj.content = '请编辑评论内容:';
    commentObj.type = 'edit';
    commentObj.selectRow = row;
    commentObj.modal = true;
    setCommentValue(row.content)
    setCommentObj({...commentObj})
  }
  const commentConfir = ()=>{
    if(!commentValue){
      message.warning('评论内容不为空');
    }
    commentObj.loading = true;
    setCommentObj({...commentObj})
    if(commentObj.type === 'add'){
      // 增加一级评论
      api.article.commentAdd({
        articleId,
        content: commentValue,
        status: '1'
      }).then((res)=>{
        let code = res.data.code
        if(code === constantData.reqSuccess){
          commentObj.modal = false;
          commentObj.loading = false;
          setCommentObj({...commentObj})
          getDataList()
        }else{
          message.warning('新增评论失败');
        }
      })
    }else if(commentObj.type === 'edit'){
      // 编辑一级评论
      api.article.commentUpdate({
        commentId: commentObj.selectRow._id,
        content: commentValue
      }).then((res)=>{
        let code = res.data.code
        if(code === constantData.reqSuccess){
          commentObj.modal = false;
          commentObj.loading = false;
          setCommentObj({...commentObj})
          getDataList()
        }else{
          message.warning('编辑评论失败');
        }
      })
    }else if(commentObj.type === 'addReply'){
      let toUser = replayCommentObj.selectRow.createUser._id
      api.article.replyCommentAdd({
        articleId,
        commentId: replayCommentObj.selectRow._id,
        toUser,
        content: commentValue
      }).then((res)=>{
        let code = res.data.code
        if(code === constantData.reqSuccess){
          replayCommentObj.selectRow = res.data.data
          tableData[replayCommentObj.index] = res.data.data
          commentObj.modal = false;
          commentObj.loading = false;
          setCommentObj({...commentObj})
          setReplayCommentObj({...replayCommentObj})
          setTableData([...tableData])
        }else{
          message.warning('新增回复评论失败')
        }
      })
    }else if(commentObj.type === 'editReply'){
      api.article.replyCommentUpdate({
        replayId: replayCommentObj.replyItem._id,
        content: commentValue
      }).then((res)=>{
        let code = res.data.code
        if(code === constantData.reqSuccess){
          replayCommentObj.selectRow.replyCommentList[replayCommentObj.replyIndex].content = commentValue
          tableData[replayCommentObj.index] = replayCommentObj.selectRow
          commentObj.modal = false;
          commentObj.loading = false;
          setCommentObj({...commentObj})
          setReplayCommentObj({...replayCommentObj})
          setTableData([...tableData])
        }else{
          message.warning('编辑回复评论失败');
        }
      })
    }else if(commentObj.type === 'reply'){
      api.article.replyCommentAdd({
        articleId,
        commentId: replayCommentObj.selectRow._id,
        toUser: replayCommentObj.replyItem.replyUser._id,
        content: commentValue
      }).then((res)=>{
        let code = res.data.code
        if(code === constantData.reqSuccess){
          replayCommentObj.selectRow = res.data.data
          tableData[replayCommentObj.index] = res.data.data
          commentObj.modal = false;
          commentObj.loading = false;
          setCommentObj({...commentObj})
          setReplayCommentObj({...replayCommentObj})
          setTableData([...tableData])
        }else{
          message.warning('新增回复评论失败')
        }
      })
    }
  }
  const commentDel = (id:string)=>{
    confirm({
      title: '提示',
      content: '此操作将永久删除该评论以及其回复评论, 是否继续?',
      closable: true,
      okType: 'danger',
      onOk() {
        return new Promise((resolve, reject) => {
          api.article.commentDel(id).then((res)=>{
            let code = res.data.code;
            resolve('')
            if(code === constantData.reqSuccess){
              getDataList();
              message.success('评论删除成功');
            }else if(code === constantData.dataAlready){
              message.warning('请先删除已启用的回复评论')
            }else{
              message.warning('评论删除失败');
            }
          })
        }).catch(() => {});
      }
    });
  }
  const commentCancel = ()=>{
    commentObj.modal = false;
    setCommentValue('')
    setCommentObj({...commentObj})
  }
  // 置顶
  const commentTop = (row:any)=>{
    let content = row.isTop?'是否确定取消该评论置顶？':'是否确定置顶该评论？'
    confirm({
      title: '提示',
      content,
      closable: true,
      onOk() {
        return new Promise((resolve, reject) => {
          api.article.commentTop({
            commentId: row._id,
            isTop: !row.isTop
          }).then((res)=>{
            let code = res.data.code;
            resolve('')
            if(code === constantData.reqSuccess){
              getDataList();
              message.success('评论置顶状态修改成功');
            }else{
              message.warning('评论置顶状态修改失败');
            }
          })
        }).catch(() => {});
      }
    });
  }
  // 打开回复评论
  const commentList = (row:any, index:number)=>{
    replayCommentObj.selectRow = row;
    replayCommentObj.index = index;
    replayCommentObj.modal = true;
    setReplayCommentObj({...replayCommentObj})
  }
  // 新增回复评论
  const replyCommentAdd = ()=>{
    if(userInfo.roleId.functionList.includes('5e834f6ffb69305aa091e82a')){
      commentObj.title = '新增回复评论';
      commentObj.content = `回复 @${replayCommentObj.selectRow.createUser.name}:`;
      commentObj.type = 'addReply';
      commentObj.modal = true;
      setCommentValue('')
      setCommentObj({...commentObj})
    }else{
      message.warning('暂无权限添加回复评论');
    }
  }
  // 回复评论关闭
  const replyCommentCancel = ()=>{
    replayCommentObj.modal = false;
    setReplayCommentObj({...replayCommentObj})
  }
  // 回复评论状态改变
  const replyCommentStatus = (item:any, index:number)=>{
    let content = item.status === '1'?'是否确定禁用该回复评论？':'是否确定启用该回复评论？'
    confirm({
      title: '提示',
      content,
      closable: true,
      onOk() {
        return new Promise((resolve, reject) => {
          api.article.replyCommentUpdate({
            replayId: item._id,
            status: item.status === '1'?'0':'1'
          }).then((res)=>{
            let code = res.data.code;
            resolve('')
            if(code === constantData.reqSuccess){
              replayCommentObj.selectRow.replyCommentList[index].status = res.data.data.status
              tableData[replayCommentObj.index] = replayCommentObj.selectRow
              setReplayCommentObj({...replayCommentObj})
              setTableData([...tableData])
            }else{
              message.warning('评论状态修改失败');
            }
          })
        }).catch(() => {});
      }
    });
  }
  // 回复评论编辑
  const replyCommentEdit = (item:any, index:number)=>{
    replayCommentObj.replyItem = item;
    replayCommentObj.replyIndex = index;
    commentObj.title = '编辑回复评论';
    commentObj.content = `编辑回复评论内容:`;
    commentObj.type = 'editReply';
    commentObj.modal = true;
    setCommentValue(item.content)
    setCommentObj({...commentObj})
    setReplayCommentObj({...replayCommentObj})
  }
  // 回复评论回复
  const replyComment = (item:any, index:number)=>{
    replayCommentObj.replyItem = item;
    replayCommentObj.replyIndex = index;
    commentObj.title = '新增回复评论';
    commentObj.content = `回复 @${item.replyUser.name}:`;
    commentObj.type = 'reply';
    commentObj.modal = true;
    setCommentValue('')
    setCommentObj({...commentObj})
    setReplayCommentObj({...replayCommentObj})
  }
  // 回复评论删除
  const replyCommentDel = (item:any, index:number)=>{
    confirm({
      title: '提示',
      content: '此操作将删除其回复评论, 是否继续?',
      closable: true,
      okType: 'danger',
      onOk() {
        return new Promise((resolve, reject) => {
          api.article.replyCommentDel(item._id).then((res)=>{
            let code = res.data.code;
            resolve('')
            if(code === constantData.reqSuccess){
              replayCommentObj.selectRow = res.data.data
              tableData[replayCommentObj.index] = res.data.data
              setReplayCommentObj({...replayCommentObj})
              setTableData([...tableData])
              message.success('回复评论删除成功')
            }else{
              message.warning('回复评论删除失败');
            }
          })
        }).catch(() => {});
      }
    });
  }

  return <div className='article-comment'>
     <h2 className='content-title'>文章评论{articleTitle?'——'+articleTitle:''}</h2>
     <div className="box-table">
      <Form
         layout='inline'
         form={searchForm}
       >
         <Form.Item label="评论状态" name='status' className='margin-bottom-20'>
            <Select allowClear={true} style={{width: '180px'}} placeholder="评论状态" onChange={()=>{getDataList()}}>
              <Select.Option value='0'>禁用</Select.Option>
              <Select.Option value='1'>正常</Select.Option>
            </Select>
         </Form.Item>
         <Form.Item label="创建时间" name='createTime' className='margin-bottom-20'>
            <RangePicker onChange={()=>{getDataList()}} />
         </Form.Item>
         <Form.Item className='margin-left-30 margin-bottom-20'>
            {
              userInfo.roleId.functionList.includes('5e834f6ffb69305aa091e82a')?<Button type="primary" onClick={commentAdd}>新增</Button>:''
            }
         </Form.Item>
       </Form>
       <div className="table-show">
       <Table rowKey='_id' columns={tableColumns} dataSource={tableData} pagination={{
         total: pageObj.total,
         showTotal: ()=>`共 ${pageObj.total} 条`,
         current: pageObj.currentPage,
         pageSize: pageObj.pageSize,
        }} onChange={tableChange} />
       </div>
     </div>
     <Modal title='评论回复' width={720} confirmLoading={replayCommentObj.loading} visible={replayCommentObj.modal} onOk={replyCommentAdd} onCancel={replyCommentCancel} okText='新增'>
     <div className="comment-box">
       {
         replayCommentObj.selectRow.replyCommentList && replayCommentObj.selectRow.replyCommentList.length === 0?<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />:''
       }
        <div className="box-list">
          {
            replayCommentObj.selectRow.replyCommentList?replayCommentObj.selectRow.replyCommentList.map((item:any, index:number)=>{
              return <div className="list-item" key={item._id}>
                {item.replyUser.avatarId?<Avatar size={40} src={`${baseURL}/file/down?downId=${item.replyUser.avatarId}`} />:<Avatar size={40} icon={<UserOutlined />} />}
                <div className="item-content">
                  <div className="content-operate">
                    <div className="operate-user">
                      <span className='user-name'>{item.replyUser?item.replyUser.name:'--'}</span>
                      <span className='comment-time'><ClockCircleOutlined style={{color:'#606266',marginRight: '3px',marginLeft: '4px'}} />{item.createTime}</span>
                    </div>
                    <div className="operate-data">
                      <Space size='middle'>
                        {
                          userInfo.roleId.functionList.includes('5e834f77fb69305aa091e82b')?
                          <Button size='small' onClick={()=>{replyCommentStatus(item,index)}} icon={item.status === '1'?<CloseCircleOutlined />:<CheckCircleOutlined />} className={item.status === '1'?'custom-button-info':'custom-button-success'}>{item.status === '1'?'禁用':'启用'}</Button>:''
                        }
                        {
                          userInfo.roleId.functionList.includes('5e834f77fb69305aa091e82b')?
                          <Button size='small' onClick={()=>{replyCommentEdit(item,index)}} type='primary' icon={<EditOutlined />}>编辑</Button>:''
                        }
                        {
                          userInfo.roleId.functionList.includes('5e834f77fb69305aa091e82b')?
                          <Button size='small' onClick={()=>{replyComment(item,index)}} className='custom-button-warning' icon={<MessageOutlined />}>回复</Button>:''
                        }
                        {
                          userInfo.roleId.functionList.includes('5e834f7efb69305aa091e82c')?
                          <Button size='small' onClick={()=>{replyCommentDel(item,index)}} type="primary" icon={<DeleteOutlined />} danger >删除</Button>:''
                        }
                      </Space>
                    </div>
                  </div>
                  <div className="content-replay">
                    {
                      item.toUser && item.replyUser && item.toUser._id !==  item.replyUser._id?<span className='replay-user'>
                        回复 <i>{item.toUser?item.toUser.name:'--'}</i> 的评论：
                      </span>:''
                    }
                    <span>
                      {item.content}
                    </span>
                  </div>
                </div>
              </div>
            }):''
          }
        </div>
       </div>
     </Modal> 
    <Modal title={commentObj.title} maskClosable={false} confirmLoading={commentObj.loading} visible={commentObj.modal} onOk={commentConfir} onCancel={commentCancel}>
      <p className='margin-bottom-20'>{commentObj.content}</p>
      <TextArea rows={3} maxLength={200} showCount={true} placeholder="评论内容" value={commentValue} onChange={textChange} />
    </Modal>    
  </div>;
};

const mapStateToProps = (state: StoreState) => ({
  stateData: state
})

export default connect(mapStateToProps)(ArticleListComment)
