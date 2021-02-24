import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Space, Table, Tree, Modal, Alert} from 'antd';
import { AudioOutlined } from '@ant-design/icons';
import { connect } from 'react-redux'
import { StoreState } from '@/store/types'
import api from '@/api/index';
import { constantData } from '@/utils/utils';
import { FormValidate } from '@/utils/format';

const Role = (props: any) => {
  const { confirm } = Modal;
  const { Search } = Input;
  const [searchForm] = Form.useForm();
  const [modalForm] = Form.useForm();
  const { TextArea } = Input;
  let userInfo = props.stateData.userInfo;
  let [tableData, setTableData] = useState<any[]>([])
  let [userTableData, setUserTableData] = useState<any[]>([])
  let [treeData, setTreeData] = useState<any[]>([])
  let [selectTreeArr, setSelectTreeArr] = useState<string[]>([])
  let [selectedRowArr, setSelectedRowArr] = useState<string[]>([])
  let [selectArr, setSelectArr] = useState<any[]>([])
  let [modalObj, setModalObj] = useState<any>({
    title: '',
    visible: false,
    loading: false,
    selectRow: {}
  })
  let [userModal, setUserModal] = useState<any>({
    type: '',
    selectName: '',
    visible: false,
    loading: false,
    selectRow: {}
  })
  let [modalAuth, setModalAuth] = useState<any>({
    visible: false,
    loading: false,
    selectRow: {}
  })
  let [pageObj, setPageObj] = useState({
    pageSize: 10,
    total: 0,
    currentPage: 1
  })
  let [userPageObj, setUserPageObj] = useState({
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
      title: '角色名称',
      sorter: true,
      align: 'center' as 'center',
      dataIndex: 'name'
    },
    {
      title: '角色描述',
      align: 'center' as 'center',
      dataIndex: 'description',
      ellipsis: true,
      render: (text:string, record:any) => (
        <span>
          {text || '--'}
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
      title: '操作',
      align: 'center' as 'center',
      width: 520,
      dataIndex: 'operate',
      render: (text:string, record:any) => (
        <Space size='large'>
          {
            userInfo.roleId.functionList.includes('5e835067fb69305aa091e83b')?
            <Button type='primary' onClick={()=>editRole(record)}>编辑</Button>:''
          }
          {
            userInfo.roleId.functionList.includes('5e83506dfb69305aa091e83c')?
            <Button type="primary" onClick={()=>roleRemove(record)} danger>删除</Button>:''
          }
          {
            userInfo.roleId.functionList.includes('5e99cb85d1ba729a78b016c2')?
            <Button className='custom-button-warning' onClick={()=>authOpen(record)}>权限分配</Button>:''
          }
          {
            userInfo.roleId.functionList.includes('5e99cb85d1ba729a78b016c2')?
            <Button className='custom-button-success' onClick={()=>userOpen('0',record)}>导入用户</Button>:''
          }
          {
            userInfo.roleId.functionList.includes('5e99cb85d1ba729a78b016c2')?
            <Button className='custom-button-info' onClick={()=>userOpen('1',record)}>移除用户</Button>:''
          }
        </Space>
      )
    }
  ]
  let userTableColumns = [
    {
      title: '用户名',
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
    }
  ]
  const userHraderFlex = {
    marginBottom: '20px',
    paddingRight: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }


  useEffect(() => {
    getDataList()
    getTreeList()
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
    api.role.roleList({
      currentPage: pageObj.currentPage,
      pageSize: pageObj.pageSize,
      name: formModel.name,
      sortBy: sortObj.sortBy,
      sortOrders
    }).then(res =>{
      let code = res.data.code
      if(code === constantData.reqSuccess){
        pageObj.total = res.data.data.count;
        setPageObj({...pageObj})
        setTableData([...res.data.data.data])
      }else{
        message.warning('获取角色列表失败');
      }
    })
  }

  const getTreeList = ()=>{
    api.menu.menuTree({}).then(res =>{
      let code = res.data.code
      if(code === constantData.reqSuccess){
        let treeList = res.data.data;
        if(treeList.length > 0){
          treeList = treeHandle(treeList)
        }
        setTreeData([...treeList])
      }else{
        message.warning('获取菜单列表失败');
      }
    })
  }
  // 树数据处理
  const treeHandle = (arr:any[])=>{
    arr.map((item:any)=>{
      if(item.functionList && item.functionList.length > 0){
        item.children = item.functionList
      }
      if (item.children && item.children.length > 0) {
        item.children = treeHandle(item.children)
      }
      item.key = item._id;
    })
    return arr
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
  const userTableChange = (pagination:any, filters:any, sorter:any) =>{
    if(userPageObj.currentPage !== pagination.current || userPageObj.pageSize !== pagination.pageSize){
      clearSelect()
      userPageObj.currentPage = pagination.current;
      userPageObj.pageSize = pagination.pageSize;
      setUserPageObj({...userPageObj})
      getUser(true)
    }
  }
  // 角色删除
  const roleRemove = (row:any)=>{
    if(row.type === '4'){
      confirm({
        title: '提示',
        content: '此操作将删除该角色信息, 是否继续?',
        closable: true,
        okType: 'danger',
        onOk() {
          return new Promise((resolve, reject) => {
            api.role.roleDel(row._id).then((res)=>{
              let code = res.data.code;
              resolve('')
              if(code === constantData.reqSuccess){
                getDataList();
                message.success('角色删除成功');
              }else if(code === constantData.dataAlready){
                message.warning('该角色不支持删除');
              }else{
                message.warning('角色删除失败');
              }
            })
          }).catch(() => {});
        }
      });
    }else{
      message.warning('该角色不支持删除');
    }
  }
  // 角色新增
  const roleAdd = ()=>{
    modalObj.title = '新增角色';
    modalObj.selectRow = {};
    modalObj.visible = true;
    setModalObj({...modalObj})
  }
  // 权限配置打开弹框
  const authOpen = (row:any)=>{
    modalAuth.visible = true;
    modalAuth.selectRow = row;
    setSelectTreeArr([...row.functionList])
    setModalAuth({...modalAuth})
  }
  // 点击树节点勾选框
  const onTreeCheck = (checkedKeys:any)=>{
    setSelectTreeArr([...checkedKeys]);
  }
  // 权限配置确认
  const modalAuthConfir = ()=>{
    let functionList:string[] = []
    let menuList:string[] = []
    let targetData:any = {}
    if(selectTreeArr.length > 0){
      treeAuthHandle(treeData[0].children, functionList)
      treeFunctionLoop(targetData,treeData)
    }
    if(functionList.length > 0){
      functionList.forEach((item)=>{
        let menuArr:string[] = getMenuArr(item,targetData)
        menuArr.pop()
        menuList = [...menuArr, ...menuList];
      })
      menuList = menuList.filter((item, index) => menuList.indexOf(item) === index);
    }
    modalAuth.loading = true;
    setModalAuth({...modalAuth})
    api.role.setRoleAuth({
      id: modalAuth.selectRow._id,
      functionList: functionList.length > 0?functionList.join(','):'',
      menuList:menuList.length > 0?menuList.join(','):''
    }).then((res)=>{
      let code = res.data.code
      modalAuth.loading = false;
      if(code === constantData.reqSuccess){
        modalAuth.visible = false;
        getDataList();
        message.success('角色权限配置成功');
      }else{
        message.warning('角色权限配置失败');
      }
      setModalAuth({...modalAuth})
    })
  }
  // 获取功能列表
  const treeAuthHandle = (data: any[], functionList: string[])=>{
    data.map((item)=>{
      if(item.children){
        treeAuthHandle(item.children, functionList)
      }else{
        if(selectTreeArr.includes(item._id)){
          functionList.push(item._id)
        }
      }
    })
  }
  // 获取从功能到菜单单链
  const treeFunctionLoop = (targetData: any, data: any[], parent?: any)=>{
    return data.map(({ children, _id }) => {
      const node:any = {
        _id,
        parent
      }
      targetData[_id] = node;
      if(children){
        node.children = treeFunctionLoop(targetData,children, node);
      }
      return
    })
  }
  // 根据功能ID获取所有父菜单ID
  const getMenuArr = (value:string, targetData: any):any[] => {
    let node = [];
    let currentNode = targetData[value];
    node.push(currentNode._id);
    if (currentNode.parent) {
      node = [...getMenuArr(currentNode.parent._id, targetData), ...node];
    }
    return node
  }
  // 角色用户列表打开
  const userOpen = (type:string, row:any)=>{
    userModal.selectRow = row;
    userModal.type = type;
    userModal.selectName = '';
    setUserModal({...userModal})
    clearSelect();
    getUser()
  }
  // 获取列表数据
  const getUser = (page?: Boolean)=>{
    userPageObj.currentPage = page === true?userPageObj.currentPage:1;
    api.role.roleUserList({
      currentPage: userPageObj.currentPage,
      pageSize: userPageObj.pageSize,
      name: userModal.selectName,
      roleId: userModal.selectRow._id,
      type: userModal.type
    }).then(res =>{
      let code = res.data.code
      if(code === constantData.reqSuccess){
        userPageObj.total = res.data.data.count;
        setUserPageObj({...userPageObj})
        setUserTableData([...res.data.data.data])
        userModal.visible = true;
        setUserModal({...userModal})
      }else{
        message.warning('获取用户列表失败');
      }
    })
  }
  const onSearch = (val:string)=>{
    userModal.selectName = val;
    setUserModal({...userModal})
    clearSelect();
    getUser()
  }
  // 导入或移除用户确认
  const userOperate = ()=>{
    userModal.loading = true;
    setUserModal({...userModal})
    let successTxt = '导入用户成功'
    let failTxt = '导入用户失败'
    if(userModal.type === '1'){
      successTxt = '移除用户成功'
      failTxt = '移除用户失败'
    }
    api.role.updateMuchUser({
      roleId: userModal.selectRow._id,
      type: userModal.type,
      ids: selectedRowArr.join(',')
    }).then(res =>{
      let code = res.data.code
      userModal.loading = false;
      if(code === constantData.reqSuccess){
        userModal.visible = false;
        message.success(successTxt);
      }else if(code === constantData.statusFail){
        message.warning('选择用户不存在');
      }else{
        message.warning(failTxt);
      }
      setUserModal({...userModal})
    })
  }
  // 编辑打开弹框
  const editRole = (row:any)=>{
    modalObj.title = '编辑角色';
    modalObj.selectRow = row;
    modalObj.visible = true;
    modalForm.setFieldsValue({ 
      name: row.name,
      description: row.description
    })
    setModalObj({...modalObj})
  }
  // 新增或编辑提交
  const modalConfir = ()=>{
    modalForm.validateFields().then((values)=>{
      modalObj.loading = true;
      setModalObj({...modalObj})
      if(modalObj.selectRow._id){
        api.role.roleUpdate({
          id: modalObj.selectRow._id,
          name: values.name,
          description: values.description
        }).then((res)=>{
          let code = res.data.code
          modalObj.loading = false;
          if(code === constantData.reqSuccess){
            modalObj.visible = false;
            getDataList();
            message.success('角色信息更新成功');
          }else if(code === constantData.dataAlready){
            message.warning('角色名称已存在');
            modalForm.setFieldsValue({ 
              name: ''
            })
          }else{
            message.warning('角色信息更新失败');
          }
          setModalObj({...modalObj})
        })
      }else{
        api.role.roleAdd({
          name: values.name,
          description: values.description
        }).then((res)=>{
          let code = res.data.code
          modalObj.loading = false;
          if(code === constantData.reqSuccess){
            modalObj.visible = false;
            modalForm.resetFields();
            getDataList();
          }else if(code === constantData.dataAlready){
            message.warning('角色名称已存在');
            modalForm.setFieldsValue({ 
              name: ''
            })
          }else{
            message.warning('角色信息添加失败');
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
  const modalAuthCancel = ()=>{
    modalAuth.visible = false;
    setModalAuth({...modalAuth})
  }
  const userModalCancel = ()=>{
    userModal.visible = false;
    clearSelect();
    setUserModal({...userModal})
  }
  // 清空所选
  const clearSelect = ()=>{
    setSelectedRowArr([])
    setSelectArr([])
  }

  return <div className='role-wrapper'>
    <h2 className='content-title'>角色管理</h2>
    <div className="box-table">
      <Form
        layout='inline'
        form={searchForm}
      >
        <Form.Item label="角色名称" name='name' className='margin-bottom-20'>
           <Input 
            maxLength={20} 
            allowClear={true}
            onBlur={()=>{getDataList()}} 
            placeholder="角色名称" 
          />
        </Form.Item>
        <Form.Item className='margin-left-30 margin-bottom-20'>
           {
             userInfo.roleId.functionList.includes('5e83505dfb69305aa091e83a')?<Button type="primary" onClick={roleAdd}>新增角色</Button>:''
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
    <Form
        form={modalForm}
        validateTrigger='onBlur'
        requiredMark={false}
        scrollToFirstError
      >
        <Form.Item
          name="name"
          label="角色名称"
          rules={FormValidate({name: '角色名称'})}
        >
          <Input 
            maxLength={20} 
            allowClear={true} 
            placeholder="角色名称" 
          />
        </Form.Item>
        <Form.Item
          name="description"
          label="角色描述"
        >
          <TextArea rows={2} maxLength={60} allowClear={true} placeholder="角色描述" />
        </Form.Item>
      </Form>
    </Modal>
    <Modal title='权限配置' okText='配置' maskClosable={false} confirmLoading={modalAuth.loading} visible={modalAuth.visible} onOk={modalAuthConfir} onCancel={modalAuthCancel}>
    <Tree
        checkable
        defaultExpandAll={true}
        selectable={false}
        checkedKeys={selectTreeArr}
        treeData={treeData}
        onCheck={onTreeCheck}
        onSelect={onTreeCheck}
      />
    </Modal>
    <Modal title={userModal.type === '1'?'移除用户':'导入用户'} footer={null} width={840} visible={userModal.visible} onCancel={userModalCancel}>
    <div style ={userHraderFlex}>
      <Search placeholder="输入用户名搜索" maxLength={20} allowClear onSearch={onSearch} style={{ width: 280 }} />
      <Button loading={userModal.loading} disabled={selectedRowArr.length === 0} type="primary" onClick={userOperate}>{userModal.type === '1'?'移除用户':'导入用户'}</Button>
    </div>
    <div className="table-show">
      {
        selectedRowArr.length > 0 && <Alert className='alert-desc' message={`已选择 ${selectedRowArr.length} 项`} closeText="清除所选" showIcon={true} type="warning" onClose={clearSelect} />
      }
    <Table 
      rowKey='_id'
      columns={userTableColumns} 
      dataSource={userTableData} 
      pagination={{
      total: userPageObj.total,
      showTotal: ()=>`共 ${userPageObj.total} 条`,
      current: userPageObj.currentPage,
      pageSize: userPageObj.pageSize,
      }} 
      rowSelection={{
        selectedRowKeys: selectedRowArr,
        onChange: (selectedRowKeys: any[], selectedRows: any[])=>{
          setSelectedRowArr([...selectedRowKeys])
          setSelectArr([...selectedRows])
        }
      }}
      onChange={userTableChange} />
    </div>
    </Modal>
  </div>;
};

const mapStateToProps = (state: StoreState) => ({
  stateData: state
})

export default connect(mapStateToProps)(Role)
