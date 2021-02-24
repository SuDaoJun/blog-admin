import React, { useState, useEffect} from "react";
import { Form, Input, Button, message, Space, Table, Alert, Modal} from 'antd';
import { connect } from 'react-redux'
import { StoreState } from '@/store/types'
import api from '@/api/index';
import ExportJsonExcel from 'js-export-excel';
import { constantData } from '@/utils/utils';
import { FormValidate } from '@/utils/format';
import './index.scss'

const User = (props: any) => {
  const { confirm } = Modal;
  let userInfo = props.stateData.userInfo;
  const [searchForm] = Form.useForm();
  const [modalForm] = Form.useForm();
  let [selectArr, setSelectArr] = useState<any[]>([])
  let [selectedRowArr, setSelectedRowArr] = useState<string[]>([])
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
  let [modalObj, setModalObj] = useState<any>({
    title: '',
    visible: false,
    loading: false,
    pwdHide: false,
    selectRow: {}
  })
  let tableColumns = [
    {
      title: '用户名',
      sorter: true,
      align: 'center' as 'center',
      dataIndex: 'name'
    },
    {
      title: '邮箱',
      align: 'center' as 'center',
      dataIndex: 'email'
    },
    {
      title: '手机号码',
      align: 'center' as 'center',
      dataIndex: 'phone',
      render: (text:string, record:any) => (
        <span>
          {text || '--'}
        </span>
      )
    },
    {
      title: '角色类型',
      sorter: true,
      align: 'center' as 'center',
      dataIndex: 'roleId',
      render: (text:string, record:any) => (
        <span>
          {record.roleId?record.roleId.name: '--'}
        </span>
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
      title: '状态',
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
      width: 320,
      align: 'center' as 'center',
      dataIndex: 'operate',
      render: (text:string, record:any) => (
        <Space>
          {
            userInfo.roleId.functionList.includes('5e835039fb69305aa091e838')?
            <Button className={record.status === '1'?'custom-button-info':'custom-button-success'} onClick={()=>updateStatus(record)}>{record.status === '1'?'禁用':'启用'}</Button>:''
          }
          {
            userInfo.roleId.functionList.includes('5e835039fb69305aa091e838')?
            <Button className='custom-button-warning' onClick={()=>resetPwd(record._id)}>重置密码</Button>:''
          }
          {
            userInfo.roleId.functionList.includes('5e835039fb69305aa091e838')?
            <Button type='primary' onClick={()=>userEdit(record)}>编辑</Button>:''
          }
          {
            userInfo.roleId.functionList.includes('5e83503ffb69305aa091e839')?
            <Button type="primary" danger onClick={()=>userDel(record._id)}>删除</Button>:''
          }
        </Space>
      )
    },
  ]

  useEffect(() => {
    getDataList()
  }, []);

  // 修改用户状态
  const updateStatus = (row:any)=>{
    let info = row.status === "1" ? "是否确定禁用该用户？" : "是否确定启用该用户？"
    confirm({
      title: '提示',
      content: info,
      closable: true,
      onOk() {
        return new Promise((resolve, reject) => {
          api.user.userUpdate({
            id: row._id,
            status: row.status === '1'?'0':'1'
          }).then((res)=>{
            let code = res.data.code;
            resolve('')
            if(code === constantData.reqSuccess){
              getDataList()
            }else{
              message.warning('用户状态修改失败');
            }
          })
        }).catch(() => {});
      }
    });
  }
  // 重置密码
  const resetPwd = (id:string)=>{
    confirm({
      title: '提示',
      content: '此操作将重置该用户密码，是否继续？',
      closable: true,
      onOk() {
        return new Promise((resolve, reject) => {
          api.user.setPwd({
            userId: id
          }).then((res)=>{
            let code = res.data.code;
            resolve('')
            if(code === constantData.reqSuccess){
              message.success('密码重置成功，新密码为123456abc')
            }else{
              message.warning('密码重置失败');
            }
          })
        }).catch(() => {});
      }
    });
  }
  // 查询数据
  const resetSearch = ()=>{
    searchForm.resetFields();
    getDataList()
  }
  // 用户操作
  const userAdd = ()=>{
    modalObj.title = '新增用户';
    modalObj.selectRow = {};
    modalObj.pwdHide = false;
    modalObj.visible = true;
    setModalObj({...modalObj})
  }
  const userEdit = (row:any)=>{
    modalForm.setFieldsValue({ 
      name: row.name,
      email: row.email,
      phone: row.phone
    })
    modalObj.pwdHide = true;
    modalObj.title = '编辑用户';
    modalObj.selectRow = row;
    modalObj.visible = true;
    setModalObj({...modalObj})
  }
  const userDel = (id:string)=>{
    confirm({
      title: '提示',
      content: '此操作将删除该用户信息, 是否继续?',
      closable: true,
      okType: 'danger',
      onOk() {
        return new Promise((resolve, reject) => {
          api.user.userDel(id).then((res)=>{
            let code = res.data.code;
            resolve('')
            if(code === constantData.reqSuccess){
              getDataList();
            }else{
              message.warning('用户删除失败');
            }
          })
        }).catch(() => {});
      }
    });
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
    api.user.userList({
      currentPage: pageObj.currentPage,
      pageSize: pageObj.pageSize,
      name: formModel.name,
      phone: formModel.phone,
      sortBy: sortObj.sortBy,
      sortOrders
    }).then(res =>{
      let code = res.data.code
      if(code === constantData.reqSuccess){
        pageObj.total = res.data.data.count;
        setPageObj({...pageObj})
        setTableData([...res.data.data.data])
      }else{
        message.warning('获取用户列表失败');
      }
    })
  }
  // table排序分页变化
  const tableChange = (pagination:any, filters:any, sorter:any) =>{
    clearSelect()
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
  // 新增或编辑提交
  const modalConfir = ()=>{
    modalForm.validateFields().then((values)=>{
      modalObj.loading = true;
      setModalObj({...modalObj})
      if(modalObj.selectRow._id){
        api.user.userUpdate({
          id: modalObj.selectRow._id,
          name: values.name,
          phone: values.phone,
          email: values.email,
        }).then((res)=>{
          let code = res.data.code
          modalObj.loading = false;
          if(code === constantData.reqSuccess){
            modalObj.visible = false;
            getDataList();
          }else if(code === constantData.dataAlready){
            message.warning('用户名已存在');
            modalForm.setFieldsValue({ 
              name: ''
            })
          }else if(code === constantData.statusFail){
            message.warning('邮箱已存在');
            modalForm.setFieldsValue({ 
              email: ''
            })
          }else{
            message.warning('用户信息更新失败');
          }
          setModalObj({...modalObj})
        })
      }else{
        api.user.userAdd({
          name: values.name,
          password: values.password,
          phone: values.phone,
          email: values.email,
        }).then((res)=>{
          let code = res.data.code
          modalObj.loading = false;
          if(code === constantData.reqSuccess){
            modalObj.visible = false;
            modalForm.resetFields();
            getDataList();
          }else if(code === constantData.dataAlready){
            message.warning('用户名已存在');
            modalForm.setFieldsValue({ 
              name: ''
            })
          }else if(code === constantData.statusFail){
            message.warning('邮箱已存在');
            modalForm.setFieldsValue({ 
              email: ''
            })
          }else{
            message.warning('用户信息添加失败');
          }
          setModalObj({...modalObj})
        })
      }
    }).catch(()=>{});
  }
  // 关闭弹框
  const modalCancel = ()=>{
    modalObj.visible = false;
    modalForm.resetFields();
    setModalObj({...modalObj})
  }
  const clearSelect = ()=>{
    setSelectedRowArr([])
    setSelectArr([])
  }
  // 导出所有
  const exportAll = ()=>{
    if(pageObj.total > 0){
      confirm({
        title: '提示',
        content: `是否确认操作所有数据，数据总共 ${pageObj.total} 条`,
        closable: true,
        onOk() {
          return new Promise((resolve, reject) => {
            let formModel = searchForm.getFieldsValue();
            let sortOrders = '';
            if(sortObj.sortOrders){
              if(sortObj.sortOrders === 'ascend'){
                sortOrders = '1';
              }else{
                sortOrders = '0';
              }
            }
            api.user.userList({
              currentPage: '1',
              pageSize: '9999',
              name: formModel.name,
              phone: formModel.phone,
              sortBy: sortObj.sortBy,
              sortOrders
            }).then(res =>{
              let code = res.data.code
              resolve('')
              if(code === constantData.reqSuccess){
                exportData(res.data.data.data)
              }else{
                message.warning('导出用户列表失败');
              }
            })
          }).catch(() => {});
        }
      });
    }else{
      message.warning('用户数据为空');
    }
  }
  // 导出数据
  const exportData = (arr?: any[])=>{
    let newArr = arr?arr:selectArr
    newArr.forEach(item=>{
      item.roleType = item.roleId?item.roleId.name:'--';
      item.userStatus = item.status === '1'?'启用':'禁用';
    })
    let option = {
      fileName: 'userList',
      datas: [
        {
          sheetData: newArr,
          sheetName:'用户数据',
          sheetFilter:['name','email','phone','roleType','createTime','userStatus'],
          sheetHeader:['用户名','邮箱','手机号','角色类型','创建时间','用户状态']
        }
      ]
    }
    let toExcel = new ExportJsonExcel(option); 
    toExcel.saveExcel();
    clearSelect()
  }

  return <div className='user-wrapper'>
     <h2 className='content-title'>用户列表</h2>
     <div className="box-table">
       <div className="search-from">
        <Form
            layout='inline'
            form={searchForm}
          >
            <Form.Item label="用户名" name='name' className='margin-bottom-20'>
               <Input 
                maxLength={20} 
                allowClear={true} 
                placeholder="用户名" 
              />
            </Form.Item>
            <Form.Item label="手机号码" name='phone' className='margin-bottom-20'>
               <Input 
                maxLength={11} 
                allowClear={true} 
                placeholder="手机号码" 
              />
            </Form.Item> 
            <Form.Item className='margin-left-30 margin-bottom-20'>
               <Space size='large'>
                 <Button type="primary" onClick={()=>getDataList()}>查询</Button>
                 {
                   userInfo.roleId.functionList.includes('5e7e06a80849b708d414da01')?<Button type="primary" onClick={userAdd}>新增</Button>:''
                 }
                 <Button onClick={resetSearch}>重置</Button>
               </Space>
            </Form.Item>
          </Form>
          {
            userInfo.roleId.functionList.includes('5e99c8a9d1ba729a78b016c1')?
            <Space className='margin-bottom-20' size='large'>
                <Button type='primary' onClick={exportAll}>导出所有</Button>
                <Button type='primary' disabled={selectedRowArr.length === 0?true:false} onClick={()=>exportData()}>导出选中</Button>
            </Space>:''
          }
       </div>
       <div className="table-show">
        {
          selectedRowArr.length > 0 && <Alert className='alert-desc' message={`已选择 ${selectedRowArr.length} 项`} closeText="清除所选" showIcon={true} type="warning" onClose={clearSelect} />
        }
       <Table 
        rowKey='_id'
        columns={tableColumns} 
        dataSource={tableData} 
        pagination={{
         total: pageObj.total,
         showTotal: ()=>`共 ${pageObj.total} 条`,
         current: pageObj.currentPage,
         pageSize: pageObj.pageSize,
        }} 
        rowSelection={{
          selectedRowKeys: selectedRowArr,
          onChange: (selectedRowKeys: any[], selectedRows: any[])=>{
            setSelectedRowArr([...selectedRowKeys])
            setSelectArr([...selectedRows])
          }
        }}
        onChange={tableChange} />
       </div>
     </div>
     <Modal title={modalObj.title} maskClosable={false} confirmLoading={modalObj.loading} visible={modalObj.visible} onOk={modalConfir} onCancel={modalCancel}>
     <Form
         form={modalForm}
         labelCol={{ span: 4 }}
         validateTrigger='onBlur'
         requiredMark={false}
         scrollToFirstError
       >
         <Form.Item
           name="name"
           label="用户名"
           rules={FormValidate({name: '用户名'})}
         >
           <Input 
             maxLength={30} 
             allowClear={true} 
             placeholder="用户名" 
           />
         </Form.Item>
         <Form.Item
           name="password"
           hidden={modalObj.pwdHide}
           label="密码"
           rules={FormValidate({type:'password',name: '密码', require: !modalObj.pwdHide})}
         >
           <Input.Password 
             type="password"
             maxLength={16}
             allowClear={true}
             placeholder="密码"
           />
         </Form.Item>
         <Form.Item
           name="confirPwd"
           hidden={modalObj.pwdHide}
           label="确认密码"
           rules={[
             {
               required: !modalObj.pwdHide,
               message: '请输入确认密码',
             },
             {
               min: 6, max: 16, message: `字符长度为6-16个字符`
             },
             ({ getFieldValue }) => ({
               validator(_, value) {
                 if (!value || getFieldValue('password') === value || value.length < 6) {
                   return Promise.resolve();
                 }
                 return Promise.reject('确认密码和密码不一致');
               },
             }),
           ]}
         >
           <Input.Password 
             type="password"
             maxLength={16}
             allowClear={true}
             placeholder="确认密码"
           />
         </Form.Item>
         <Form.Item
           name="email"
           label="邮箱"
           rules={FormValidate({type: 'email', name: '邮箱'})}
         >
           <Input 
             maxLength={40} 
             allowClear={true} 
             placeholder="邮箱" 
           />
         </Form.Item>
         <Form.Item
           name="phone"
           label="手机号码"
           rules={FormValidate({type: 'phone', name: '手机号', emptyBool: true})}
         >
           <Input 
             maxLength={11} 
             allowClear={true} 
             placeholder="手机号码（选填）" 
           />
         </Form.Item>
       </Form>
     </Modal>
  </div>;
};

const mapStateToProps = (state: StoreState) => ({
  stateData: state
})

export default connect(mapStateToProps)(User)
