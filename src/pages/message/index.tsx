import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, DatePicker, Space, Table, Modal} from 'antd';
import { connect } from 'react-redux'
import { StoreState } from '@/store/types'
import api from '@/api/index';
import { constantData, currentSelectTime } from '@/utils/utils';

const MessageList = (props: any) => {
  const { confirm } = Modal;
  const { TextArea } = Input;
  const [searchForm] = Form.useForm();
  const { RangePicker } = DatePicker;
  let userInfo = props.stateData.userInfo;
  let [tableData, setTableData] = useState<any[]>([])
  let [messageValue, setMessageValue] = useState('')
  let [modalObj, setModalObj] = useState<any>({
    title: '',
    content: '',
    visible: false,
    loading: false,
    selectRow: {}
  })
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
      title: '留言用户',
      sorter: true,
      align: 'center' as 'center',
      dataIndex: 'name',
      render: (text:string, record:any) => (
        <span>
          {record.createUser?record.createUser.name:'--'}
        </span>
      )
    },
    {
      title: '留言内容',
      align: 'center' as 'center',
      dataIndex: 'content',
      ellipsis: true
    },
    {
      title: '留言时间',
      sorter: true,
      align: 'center' as 'center',
      dataIndex: 'createTime',
      render: (text:string, record:any) => (
        <span>
          {text || '--'}
        </span>
      )
    },
    {
      title: '留言状态',
      sorter: true,
      align: 'center' as 'center',
      dataIndex: 'status',
      render: (text:string, record:any) => (
        <span style={{color: text === '1'?'#02BB00':'#909399'}}>
          {text === '1'?'启用':'禁用'}
        </span>
      )
    },
    {
      title: '操作',
      align: 'center' as 'center',
      dataIndex: 'operate',
      render: (text:string, record:any) => (
        <Space size='large'>
          {
            userInfo.roleId.functionList.includes('5e834fc4fb69305aa091e834')?
            <Button className={record.status === '1'?'custom-button-info':'custom-button-success'} onClick={()=>statusChange(record)}>{record.status === '1'?'禁用':'启用'}</Button>:''
          }
          {
            userInfo.roleId.functionList.includes('5e834fc4fb69305aa091e834')?
            <Button type='primary' onClick={()=>editMessage(record)}>编辑</Button>:''
          }
          {
            userInfo.roleId.functionList.includes('5e834fcbfb69305aa091e835')?
            <Button type="primary" onClick={()=>messageRemove(record._id)} danger>删除</Button>:''
          }
        </Space>
      )
    }
  ]

  useEffect(() => {
    getDataList()
  }, []);

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
    api.message.messageList({
      currentPage: pageObj.currentPage,
      pageSize: pageObj.pageSize,
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
        message.warning('获取留言列表失败');
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
  // 留言删除
  const messageRemove = (id:string)=>{
    confirm({
      title: '提示',
      content: '此操作将删除该留言, 是否继续?',
      closable: true,
      okType: 'danger',
      onOk() {
        return new Promise((resolve, reject) => {
          api.message.messageDel(id).then((res)=>{
            let code = res.data.code;
            resolve('')
            if(code === constantData.reqSuccess){
              getDataList();
              message.success('留言删除成功');
            }else{
              message.warning('留言删除失败');
            }
          })
        }).catch(() => {});
      }
    });
  }
  // 状态修改
  const statusChange = (row:any)=>{
    let info = row.status === "1" ? "是否确定禁用该留言？" : "是否确定启用该留言？"
    confirm({
      title: '提示',
      content: info,
      closable: true,
      onOk() {
        return new Promise((resolve, reject) => {
          api.message.messageUpdate({
            id: row._id,
            status: row.status === '1'?'0':'1'
          }).then((res)=>{
            let code = res.data.code;
            resolve('')
            if(code === constantData.reqSuccess){
              getDataList()
            }else{
              message.warning('留言状态修改失败');
            }
          })
        }).catch(() => {});
      }
    });
  }
  // 留言内容变化
  const textChange = (e:any)=>{
    setMessageValue(e.target.value)
  }
  // 留言新增
  const messageAdd = ()=>{
    modalObj.title = '新增留言';
    modalObj.content = '请输入留言内容';
    modalObj.selectRow = {};
    modalObj.visible = true;
    setModalObj({...modalObj})
  }
  // 编辑打开弹框
  const editMessage = (row:any)=>{
    modalObj.title = '编辑留言';
    modalObj.content = '请编辑留言内容';
    modalObj.selectRow = row;
    modalObj.visible = true;
    setMessageValue(row.content)
    setModalObj({...modalObj})
  }
  // 新增或编辑提交
  const modalConfir = ()=>{
    if(!messageValue){
      return message.warning('评论内容不能为空')
    }
    modalObj.loading = true;
    setModalObj({...modalObj})
    if(modalObj.selectRow._id){
      api.message.messageUpdate({
        id: modalObj.selectRow._id,
        content: messageValue
      }).then((res)=>{
        let code = res.data.code
        modalObj.loading = false;
        if(code === constantData.reqSuccess){
          modalObj.visible = false;
          getDataList();
          message.success('留言信息更新成功');
        }else{
          message.warning('留言信息更新失败');
        }
        setModalObj({...modalObj})
      })
    }else{
      api.message.messageAdd({
        status: '1',
        content: messageValue
      }).then((res)=>{
        let code = res.data.code
        modalObj.loading = false;
        if(code === constantData.reqSuccess){
          modalObj.visible = false;
          getDataList();
          message.success('留言信息添加成功');
        }else{
          message.warning('留言信息添加失败');
        }
        setModalObj({...modalObj})
      })
    }
  }
  // 关闭弹框
  const modalCancel = ()=>{
    modalObj.visible = false;
    setMessageValue('')
    setModalObj({...modalObj})
  }

  return <div className='message-wrapper'>
    <h2 className='content-title'>留言管理</h2>
    <div className="box-table">
      <Form
        layout='inline'
        form={searchForm}
      >
        <Form.Item label="时间范围" name='createTime' className='margin-bottom-20'>
           <RangePicker onChange={()=>{getDataList()}} />
        </Form.Item>
        <Form.Item className='margin-left-30 margin-bottom-20'>
           {
             userInfo.roleId.functionList.includes('5e834fbdfb69305aa091e833')?<Button type="primary" onClick={messageAdd}>新增</Button>:''
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
    <Modal title={modalObj.title} maskClosable={false} confirmLoading={modalObj.loading} visible={modalObj.visible} onOk={modalConfir} onCancel={modalCancel}>
    <p className='margin-bottom-20'>{modalObj.content}</p>
    <TextArea rows={3} maxLength={200} showCount={true} placeholder="评论内容" value={messageValue} onChange={textChange} />
    </Modal>
  </div>;
};

const mapStateToProps = (state: StoreState) => ({
  stateData: state
})

export default connect(mapStateToProps)(MessageList)
