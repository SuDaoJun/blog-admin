import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, DatePicker, Space, Tabs, Table, Modal, Image, Radio, Upload, Progress } from 'antd';
import { UploadOutlined  } from '@ant-design/icons';
import { connect } from 'react-redux'
import { StoreState } from '@/store/types'
import api from '@/api/index';
import { baseURL } from "@/api/axios";
import moment from 'moment'
import { constantData, currentSelectTime } from '@/utils/utils';
import { FormValidate } from '@/utils/format';

const Project = (props: any) => {
  const { confirm } = Modal;
  const { TabPane } = Tabs;
  const { TextArea } = Input;
  const [searchForm] = Form.useForm();
  const [modalForm] = Form.useForm();
  const { RangePicker } = DatePicker;
  let userInfo = props.stateData.userInfo;
  let [tableData, setTableData] = useState<any[]>([])
  let [percent, setPercent] = useState(0);
  let [sourceId, setSourceId] = useState('')
  let [projectStatus, setProjectStatus] = useState('1')
  let [modalObj, setModalObj] = useState<any>({
    title: '',
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
      title: '项目名称',
      sorter: true,
      align: 'center' as 'center',
      dataIndex: 'name'
    },
    {
      title: '项目封面',
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
      title: '项目描述',
      align: 'center' as 'center',
      dataIndex: 'description',
      ellipsis: true
    },
    {
      title: '开始时间',
      sorter: true,
      align: 'center' as 'center',
      dataIndex: 'startTime',
      render: (text:string, record:any) => (
        <span>
          {text || '--'}
        </span>
      )
    },
    {
      title: '结束时间',
      sorter: true,
      align: 'center' as 'center',
      dataIndex: 'endTime',
      render: (text:string, record:any) => (
        <span>
          {text || '--'}
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
            userInfo.roleId.functionList.includes('5e834f5afb69305aa091e828')?
            <Button type='primary' onClick={()=>editProject(record)}>编辑</Button>:''
          }
          {
            userInfo.roleId.functionList.includes('5e834f61fb69305aa091e829')?
            <Button type="primary" onClick={()=>projectRemove(record._id)} danger>删除</Button>:''
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
    api.project.projectList({
      currentPage: pageObj.currentPage,
      pageSize: pageObj.pageSize,
      status: projectStatus,
      name: formModel.name,
      startTime: formModel.startTime?currentSelectTime(formModel.startTime[0])+','+currentSelectTime(formModel.startTime[1]):null,
      sortBy: sortObj.sortBy,
      sortOrders
    }).then(res =>{
      let code = res.data.code
      if(code === constantData.reqSuccess){
        pageObj.total = res.data.data.count;
        setPageObj({...pageObj})
        setTableData([...res.data.data.data])
      }else{
        message.warning('获取项目列表失败');
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
    projectStatus = key
    setProjectStatus(key)
    getDataList()
  }
  // 项目删除
  const projectRemove = (id:string)=>{
    confirm({
      title: '提示',
      content: '此操作将删除该项目, 是否继续?',
      closable: true,
      okType: 'danger',
      onOk() {
        return new Promise((resolve, reject) => {
          api.project.projectDel(id).then((res)=>{
            let code = res.data.code;
            resolve('')
            if(code === constantData.reqSuccess){
              getDataList();
              message.success('项目删除成功');
            }else{
              message.warning('项目删除失败');
            }
          })
        }).catch(() => {});
      }
    });
  }
  // 项目新增
  const projectAdd = ()=>{
    modalObj.title = '新增项目';
    modalObj.selectRow = {};
    modalForm.setFieldsValue({ 
      status: '2'
    })
    modalObj.visible = true;
    setModalObj({...modalObj})
  }
  // 编辑打开弹框
  const editProject = (row:any)=>{
    modalForm.setFieldsValue({ 
      name: row.name,
      startTime: row.startTime?moment(row.startTime,'YYYY-MM-DD'):'',
      endTime: row.endTime?moment(row.endTime,'YYYY-MM-DD'):'',
      status: row.status,
      linkUrl: row.linkUrl,
      description: row.description
    })
    modalObj.title = '编辑项目';
    modalObj.selectRow = row;
    modalObj.visible = true;
    setSourceId(row.imgId)
    setModalObj({...modalObj})
  }
  // 新增或编辑提交
  const modalConfir = ()=>{
    modalForm.validateFields().then((values)=>{
      modalObj.loading = true;
      setModalObj({...modalObj})
      if(modalObj.selectRow._id){
        api.project.projectUpdate({
          id: modalObj.selectRow._id,
          name: values.name,
          linkUrl: values.linkUrl,
          status: values.status,
          startTime: values.startTime?currentSelectTime(values.startTime):null,
          endTime: values.endTime?currentSelectTime(values.endTime):null,
          imgId: sourceId?sourceId:null,
          description: values.description
        }).then((res)=>{
          let code = res.data.code
          modalObj.loading = false;
          if(code === constantData.reqSuccess){
            modalObj.visible = false;
            getDataList();
            message.success('项目信息更新成功');
          }else if(code === constantData.dataAlready){
            message.warning('项目名称已存在');
            modalForm.setFieldsValue({ 
              name: ''
            })
          }else{
            message.warning('项目信息更新失败');
          }
          setModalObj({...modalObj})
        })
      }else{
        api.project.projectAdd({
          name: values.name,
          linkUrl: values.linkUrl,
          status: values.status,
          startTime: values.startTime?currentSelectTime(values.startTime):null,
          endTime: values.endTime?currentSelectTime(values.endTime):null,
          imgId: sourceId?sourceId:null,
          description: values.description
        }).then((res)=>{
          let code = res.data.code
          modalObj.loading = false;
          if(code === constantData.reqSuccess){
            modalObj.visible = false;
            getDataList();
            modalForm.resetFields();
            message.success('项目信息添加成功');
          }else if(code === constantData.dataAlready){
            message.warning('项目名称已存在');
            modalForm.setFieldsValue({ 
              name: ''
            })
          }else{
            message.warning('项目信息添加失败');
          }
          setModalObj({...modalObj})
        })
      }
    }).catch(()=>{});
  }
  // 关闭弹框
  const modalCancel = ()=>{
    modalObj.visible = false;
    setSourceId('')
    modalForm.resetFields();
    setModalObj({...modalObj})
  }

  // 开始时间禁用
  const startTimeDisable = (currentDate: any)=>{
    let endTime = modalForm.getFieldValue('endTime');
    if(!currentDate || !endTime){
      return currentDate.valueOf() > new Date().getTime();
    }
    return endTime <= currentDate.valueOf();
  }
  // 结束时间禁用
  const endTimeDisable = (currentDate: any)=>{
    let startTime = modalForm.getFieldValue('startTime');
    if (!currentDate || !startTime) {
      return currentDate.valueOf() < new Date().getTime();
    }
    return currentDate.valueOf() <= startTime
  }
  // 项目封面上传
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

  return <div className='project-wrapper'>
    <h2 className='content-title'>项目管理</h2>
    <div className="box-table">
      <Form
        layout='inline'
        form={searchForm}
      >
        <Form.Item label="项目名称" name='name' className='margin-bottom-20'>
           <Input 
            maxLength={20} 
            allowClear={true}
            onBlur={()=>{getDataList()}} 
            placeholder="项目名称" 
          />
        </Form.Item>
        <Form.Item label="时间范围" name='startTime' className='margin-bottom-20'>
           <RangePicker onChange={()=>{getDataList()}} />
        </Form.Item>
        <Form.Item className='margin-left-30 margin-bottom-20'>
           {
             userInfo.roleId.functionList.includes('5e834f88fb69305aa091e82d')?<Button type="primary" onClick={projectAdd}>新增</Button>:''
           }
        </Form.Item>
      </Form>
      <Tabs defaultActiveKey={projectStatus} size='large' onChange={tabsChange}>
        <TabPane tab="已完成" key="1">
        </TabPane>
        <TabPane tab="进行中" key="2">
        </TabPane>
        <TabPane tab="已废弃" key="3">
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
    <Modal title={modalObj.title} maskClosable={false} confirmLoading={modalObj.loading} visible={modalObj.visible} onOk={modalConfir} onCancel={modalCancel}>
    <Form
        form={modalForm}
        validateTrigger='onBlur'
        requiredMark={false}
        scrollToFirstError
      >
        <Form.Item
          name="name"
          label="项目名称"
          rules={FormValidate({name: '项目名称'})}
        >
          <Input 
            maxLength={20} 
            allowClear={true} 
            placeholder="项目名称" 
          />
        </Form.Item>
        <Form.Item
          name="linkUrl"
          label="项目地址"
          rules={FormValidate({name: '项目地址'})}
        >
          <Input 
            allowClear={true} 
            placeholder="项目地址" 
          />
        </Form.Item>
        <Form.Item
          name="startTime"
          label="开始时间"
          validateTrigger='onChange'
          rules={FormValidate({type: 'array', name: '开始时间'})}
        >
          <DatePicker disabledDate={startTimeDisable} />
        </Form.Item>
        <Form.Item
          name="endTime"
          label="结束时间"
        >
          <DatePicker disabledDate={endTimeDisable} />
        </Form.Item>
        <Form.Item 
          name="status" 
          label="项目状态"
        >
          <Radio.Group>
            <Radio value="2">进行中</Radio>
            <Radio value="1">已完成</Radio>
            <Radio value="3">已废弃</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="upload"
          label="项目封面"
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
          </div>
        </Form.Item>
        <Form.Item
          name="description"
          label="项目描述"
          rules={FormValidate({name: '项目描述'})}
        >
           <TextArea rows={3} maxLength={200} allowClear={true} placeholder="项目描述" />
        </Form.Item>
      </Form>
    </Modal>
  </div>;
};

const mapStateToProps = (state: StoreState) => ({
  stateData: state
})

export default connect(mapStateToProps)(Project)
