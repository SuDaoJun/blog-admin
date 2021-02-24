import React, { useState, useEffect } from "react";
import { Switch, useHistory, Link } from 'react-router-dom'
import { Menu, Breadcrumb, Drawer, Badge, message, Empty, Dropdown, Avatar, Modal, Button, Form, Input, Upload, Progress, } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  CloseCircleFilled,
  UserOutlined,
  EditOutlined,
  FireOutlined,
  HomeOutlined,
  LinkOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { StoreState } from '@/store/types'
import { setUserInfo } from '@/store/actions'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { getRouteArr, RouteWithSubRoutes, RoutersArr } from "@/router/route";
import { constantData} from '@/utils/utils';
import { FormValidate } from '@/utils/format';
import { baseURL } from "@/api/axios";
import api from '@/api/index';
import TagsView from '@/components/tagsView/TagsView';
import "./index.scss";


const BasicLayout = (props:any) => {
  const history = useHistory();
  const { SubMenu } = Menu;
  const { TextArea } = Input;
  const [personForm] = Form.useForm();
  const [pwdForm] = Form.useForm();
  const [stateForm] = Form.useForm();
  const statementArr = [
    {
      name: 'monday',
      label: '星期一',
      info: '星期一励志语句'
    },
    {
      name: 'tuesday',
      label: '星期二',
      info: '星期二励志语句'
    },
    {
      name: 'wednesday',
      label: '星期三',
      info: '星期三励志语句'
    },
    {
      name: 'thursday',
      label: '星期四',
      info: '星期四励志语句'
    },
    {
      name: 'friday',
      label: '星期五',
      info: '星期五励志语句'
    },
    {
      name: 'saturday',
      label: '星期六',
      info: '星期六励志语句'
    },
    {
      name: 'sunday',
      label: '星期日',
      info: '星期日励志语句'
    }
  ]

  let userInfo = props.stateData.userInfo;
  let [collapse, getCollapse] = useState(false);
  let [routeArr, getRoute] = useState<any[]>([]);
  let [menuRouteArr, getMenuRouteArr] = useState<any[]>([]);
  let [breadListArr, getBreadListArr] = useState<any[]>([]);
  let [drawer, setDrawer] = useState(false);
  let [badgeNum, setBadgeNum] = useState(0);
  let [noticeLists, setNoticeLists] = useState<any[]>([]);
  let [statementList, setStatementList] = useState<any[]>([]);
  let [selectKeyArr, setSelectKeyArr] = useState<string[]>([]);
  let [personVisible, setPersonVisible] = useState(false);
  let [personLoading, setPersonLoading] = useState(false);
  let [pwdVisible, setPwdVisible] = useState(false);
  let [pwdLoading, setPwdLoading] = useState(false);
  let [stateVisible, setStateVisible] = useState(false);
  let [stateLoading, setStateLoading] = useState(false);
  let [percent, setPercent] = useState(0);
  let [userAvatarId, setUserAvatarId] = useState('');

  useEffect(() => {
    if(sessionStorage.getItem('collapse') && sessionStorage.getItem('collapse') === '1'){
      getCollapse(true)
    }
    // 消息提示
    let noticeLists:any[] = []
    let noticeStr = localStorage.getItem('noticeLists');
    if(noticeStr && typeof noticeStr === 'string'){
      noticeLists = JSON.parse(noticeStr);
    }
    if(noticeLists.length > 0){
      let badgeNum = 0
      noticeLists.forEach(item=>{
        if(item.isRead === false){
          badgeNum++
        }
      })
      setBadgeNum(badgeNum)
    }
    setNoticeLists(noticeLists)
    // 获取路由
    let routeArrList = getRouteArr()
    getRoute(routeArrList)
    getMenuRouteArr(routeMenu(routeArrList))
    getStatementList()

   
  }, [])

  useEffect(()=>{
    // 获取面包屑
    getBreadCrumb()
    // 获取默认高亮
    getSelectKeyArr()
  },[props.location.pathname])

  // 获取高亮
  const getSelectKeyArr =()=>{
    let pathName:string = props.location.pathname;
    if(pathName === '/article/comment' || pathName === '/article/edit'){
      pathName = '/article/articleList'
    }
    let arr:string[] = [pathName];
    setSelectKeyArr(arr)
  }
  // 获取面包屑
  const getBreadCrumb = ()=>{
    let breadList:any[] = [];
    let pathName = props.location.pathname;
    if(pathName === '/index'){
      breadList = [{ path: '/index', name: '首页'}]
    }else{
      RoutersArr.forEach(item=>{
        if(item.path === pathName){
          if(item.supTitle){
            breadList = [{ path: '/index', name: '首页'},{ path: '', name: item.supTitle},{ path: item.path, name: item.meta.title}]
          }else{
            breadList = [{ path: '/index', name: '首页'},{ path: item.path, name: item.meta.title}]
          }
        }
      })
    }
    getBreadListArr(breadList)
  }
  // 路由数据转换成菜单形式
  const routeMenu = (routeArrList: any[])=>{
    let arr:any[]= routeArrList.filter(item => !item.hidden)
    let tempArr :string[] = [];
    let newArr:any[] = [];
    arr.forEach(item=>{
      if(item.supTitle){
        if (tempArr.indexOf(item.supTitle) === -1) {
          newArr.push({
            title: item.supTitle,
            path: item.supTitle,
            icon: item.meta.icon,
            children: [item]
          });
          tempArr.push(item.supTitle);
        } else {
          for (let j = 0; j < newArr.length; j++) {
            if (newArr[j].title ===item.supTitle) {
              newArr[j].children.push(item);
              break;
            }
          }
        }
      }else{
        newArr.push(item)
      }
    })
    return newArr
  }
  // 获取励志语句
  const getStatementList = ()=>{
    api.user.statementList({}).then(res=>{
      let code = res.data.code
      if(code === constantData.reqSuccess){
        setStatementList(res.data.data)
      }
    })
  }
  // 消息提示
  const readAll = ()=>{
    if(noticeLists.length > 0){
      noticeLists.forEach(item=>{
        item.isRead = true
      })
      setBadgeNum(0)
      setNoticeLists(noticeLists)
      localStorage.setItem('noticeLists',JSON.stringify(noticeLists))
    }
  }
  const clearAll = ()=>{
    if(noticeLists.length > 0){
      setBadgeNum(0)
      setNoticeLists([])
      localStorage.removeItem('noticeLists')
      message.success('消息已清空')
    }
  }
  const readChange = (index:number)=>{
    if(noticeLists[index].isRead === false){
      noticeLists[index].isRead = true
      badgeNum--
      setBadgeNum(badgeNum)
      setNoticeLists(noticeLists)
      localStorage.setItem('noticeLists',JSON.stringify(noticeLists))
    }
  }
  const clearSingle = (e:any, item:any, index:number)=>{
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if(!item.isRead){
      badgeNum--
      setBadgeNum(badgeNum)
    }
    noticeLists.splice(index,1)
    setNoticeLists([...noticeLists])
    localStorage.setItem('noticeLists',JSON.stringify(noticeLists))
  }
  // 回到首页
  const logoIndex = ()=>{
    history.replace('/index')
  }
  // 侧边栏折叠
  const collapseChange = ()=>{
    if(collapse === true){
      sessionStorage.setItem('collapse', '0')
    }else{
      sessionStorage.setItem('collapse', '1')
    }
    getCollapse(!collapse)
  }
  // 操作菜单栏
  const handleCommand = (e:any)=>{
    let key:string = e.key;
    if(key === 'personal'){
      setUserAvatarId(userInfo.avatarId)
      personForm.resetFields();
      personForm.setFieldsValue({ 
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        info: userInfo.info,
      })
      setPersonVisible(true)
    }else if(key === 'modifyPwd'){
      pwdForm.resetFields();
      setPwdVisible(true)
    }else if(key === 'statement'){
      stateForm.resetFields();
      if(statementList.length > 0){
        stateForm.setFieldsValue({ 
          monday: statementList[0].title,
          tuesday: statementList[1].title,
          wednesday: statementList[2].title,
          thursday: statementList[3].title,
          friday: statementList[4].title,
          saturday: statementList[5].title,
          sunday: statementList[6].title
        })
      }
      setStateVisible(true)
    }else if(key === 'blog'){
      window.open("//sdjBlog.cn")
    }else if(key === 'github'){
      window.open("https://github.com/SuDaoJun")
    }else if(key === 'logout'){
      logouts()
    }
  }
  const dropdownMenu = ()=>{
    if(userInfo.roleId && userInfo.roleId.functionList.includes('5ea6fa245fb5d2567c6cad54')){
      return <Menu onClick={handleCommand}>
        <Menu.Item key="personal" icon={<UserOutlined />}>个人资料</Menu.Item>
        <Menu.Item key="modifyPwd" icon={<EditOutlined />}>修改密码</Menu.Item>
        <Menu.Item key="statement" icon={<FireOutlined />}>励志语句</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="blog"  icon={<HomeOutlined />}>博客展示</Menu.Item>
        <Menu.Item key="github" icon={<LinkOutlined />}>Github</Menu.Item>
        <Menu.Item key="logout" icon={<LogoutOutlined />}>退出登录</Menu.Item>
      </Menu>
    }else{
      return <Menu onClick={handleCommand}>
        <Menu.Item key="personal" icon={<UserOutlined />}>个人资料</Menu.Item>
        <Menu.Item key="modifyPwd" icon={<EditOutlined />}>修改密码</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="blog"  icon={<HomeOutlined />}>博客展示</Menu.Item>
        <Menu.Item key="github" icon={<LinkOutlined />}>Github</Menu.Item>
        <Menu.Item key="logout" icon={<LogoutOutlined />}>退出登录</Menu.Item>
      </Menu>
    }
  };
  // 侧边菜单点击
  const menuPathClick = (e:any)=>{
    let path:string = e.key;
    history.replace(path)
  }
  //个人资料
  const personHandleOk = ()=>{
    personForm.validateFields().then((values)=>{
      setPersonLoading(true)
      api.user.userUpdate({
        id: userInfo._id,
        avatarId: userAvatarId || userInfo.avatarId,
        name: values.name,
        email: values.email,
        phone: values.phone,
        info: values.info
      }).then((res)=>{
        setPersonLoading(false)
        let code = res.data.code
        if(code === constantData.reqSuccess){
          userInfo = res.data.data
          sessionStorage.setItem('userInfo',JSON.stringify(userInfo))
          props.setUserInfo(userInfo)
          setPersonVisible(false)
          message.success('更新信息成功')
        }else if(code === constantData.dataAlready){
          message.error('用户名已存在')
          personForm.setFieldsValue({ 
            name: ''
          })
        }else if(code === constantData.statusFail){
          message.error('邮箱已存在')
          personForm.setFieldsValue({ 
            email: ''
          })
        }else{
          message.error('更新信息失败')
        }
      }).catch(()=>{
        setPersonLoading(false)
      })
    }).catch(()=>{});
  }
  const personUploadProps = {
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
          setUserAvatarId(fileData.sourceId)
        }else{
          setPercent(0)
          message.warning('文件上传失败');
        }
      })
      return false;
    }
  };
  // 修改密码
  const pwdHandleOk = ()=>{
    pwdForm.validateFields().then((values)=>{
      setPwdLoading(true)
      api.user.modifyPwd({
        password: values.oldPwd,
        newPassword: values.newPwd
      }).then((res)=>{
        setPwdLoading(false)
        let code = res.data.code
        if(code === constantData.reqSuccess){
          setPwdVisible(false)
          logouts()
          message.success('密码修改成功，请重新登录');
        }else if(code === constantData.dataFail){
          message.error('用户不存在');
        }else if(code === constantData.pwdFail){
          message.error('原密码错误');
        }else{
          message.error('密码修改错误')
        }
      }).catch(()=>{
        setPwdLoading(false)
      })
    }).catch(()=>{});
  }
  // 励志语句
  const stateHandleOk = ()=>{
    stateForm.validateFields().then((values)=>{
      let idArr:string[] = []
      let dataList:any[] = []
      setStateLoading(true)
      if(statementList.length > 0){
        statementList.forEach(item=>{
          idArr.push(item._id)
        })
      }
      dataList = [
        {
          title: values.monday,
          sortNum: 1
        },
        {
          title: values.tuesday,
          sortNum: 2
        },
        {
          title: values.wednesday,
          sortNum: 3
        },
        {
          title: values.thursday,
          sortNum: 4
        },
        {
          title: values.friday,
          sortNum: 5
        },
        {
          title: values.saturday,
          sortNum: 6
        },
        {
          title: values.sunday,
          sortNum: 7
        }
      ]
      api.user.statementUpdate({
        idArr,
        dataList
      }).then((res)=>{
        setStateLoading(false)
        let code = res.data.code
        if(code === constantData.reqSuccess){
          setStateVisible(false)
          getStatementList()
          message.success('励志语句编辑成功');
        }else{
          message.error('励志语句编辑失败')
        }
      }).catch(()=>{
        setStateLoading(false)
      })
    }).catch(()=>{});
  }
  
  // 退出登录
  const logouts = ()=>{
    sessionStorage.removeItem('token')
    history.replace('/login')
  }
  return (
    <div className={collapse?"index-layout index-collapse":"index-layout"}>
      <div className="layout-sidebar">
        {
          collapse?
          '':<div className="sider-logo" onClick={logoIndex}>
            {userInfo.name || 'Blog'}
          </div>
        }
        <div className="sider-menu">
          <Menu
            selectedKeys={selectKeyArr}
            mode="inline"
            theme='dark'
            onClick={menuPathClick}
            inlineCollapsed={collapse}
          >
            {
              menuRouteArr.map(item=>{
                if(item.children && item.children.length > 0){
                  return (<SubMenu key={item.path} icon={<span className={item.icon} />} title={item.title}>

                    {item.children.map((itemData:any)=>{
                      return <Menu.Item key={itemData.path}>{itemData.meta.title}</Menu.Item>
                    })}
                  </SubMenu>)
                }else{
                  return <Menu.Item key={item.path} icon={<span className={item.meta.icon} />}>
                    {item.meta.title}
                  </Menu.Item>
                }
              })
            }
          </Menu>
        </div>
      </div>
      <div className="layout-container">
        <div className="container-header fixed-header">
          <div className="info-header">
            <div className="header-left">
              <div className="left-collapse" onClick={collapseChange}>
                {collapse?<MenuUnfoldOutlined className='collapse-color' />:<MenuFoldOutlined className='collapse-color' />}
              </div>
              <TransitionGroup>
                <CSSTransition
                    timeout={300}
                    classNames="slide"
                >
                  <Breadcrumb>
                    {
                      breadListArr.map(item=>{
                        return <Breadcrumb.Item key={item.name}>
                          {
                            item.path?<Link to={item.path}>{item.name}</Link>:item.name
                          }
                        </Breadcrumb.Item>
                      })
                    }
                  </Breadcrumb>
                </CSSTransition>	
              </TransitionGroup>
            </div>
            <div className="header-right">
              <div className="right-notice" onClick={()=>{setDrawer(true)}}>
                <Badge count={badgeNum} size="default">
                  <BellOutlined style={{fontSize: '22px', color: '#606266'}} />
                </Badge>
              </div>
              <Dropdown overlay={dropdownMenu} trigger={['click']} placement='bottomCenter'>
                <div className="el-dropdown-link">
                {userInfo.avatarId?<Avatar size={40} src={`${baseURL}/file/down?downId=${userInfo.avatarId}`} />:<Avatar size={40} icon={<UserOutlined />} />}
                   <span className='link-name'>{userInfo.name || '--'}</span>
                </div>
              </Dropdown>
            </div>
          </div>
          <TagsView props={props} />
        </div>
        <div className="container-show">
          <Switch>
            {routeArr.map((route, i) => (
              <RouteWithSubRoutes key={i} {...route} />
            ))}
          </Switch>
        </div>
      </div>
      {/* 操作消息中心 */}
      <Drawer
        title="消息中心"
        width={576}
        getContainer={false}
        onClose={()=>{setDrawer(false)}}
        visible={drawer}
      >
        <div className="notice-clear">
          <div className="clear-all" onClick={readAll}>全部已读</div>
          <div className="clear-all" onClick={clearAll}>清空消息</div>
        </div>
        {
          noticeLists.map((item,index)=>{
            return <div className={item.isRead?'notice-list notice-read':'notice-list'} key={index} onClick={()=>readChange(index)}>
              <p>{item.createTime}</p>
              <div className="box-info">
                <span>执行操作：</span>
                <span className='info-operate'>{item.title}</span>
              </div>
              <CloseCircleFilled className="clear-single" onClick={(e)=>clearSingle(e,item,index)} />
            </div>
          })
        }
        {
          noticeLists.length === 0?<Empty description='暂无消息' image={Empty.PRESENTED_IMAGE_SIMPLE} />:''
        }
      </Drawer>
      {/* 个人信息 */}
      <Modal
        title="个人资料"
        width={640}
        maskClosable={false}
        visible={personVisible}
        okText='更新信息'
        onOk={personHandleOk}
        confirmLoading={personLoading}
        onCancel={()=>{setPersonVisible(false)}}
      >
        <div className="person-info">
          <div className="info-avatar">
            {userAvatarId?<Avatar size={90} src={`${baseURL}/file/down?downId=${userAvatarId}`} />:<Avatar size={90} icon={<UserOutlined />} />}
            <Upload  {...personUploadProps}>
              <Button style={{margin: '10px 0'}}>{userAvatarId?'更换头像':'上传头像'}</Button>
            </Upload>
            {
              percent === 0?'': <Progress
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                percent={percent}
              />
            }
          </div>
          <Form
            form={personForm}
            requiredMark={false}
            className='form-modal'
            validateTrigger='onBlur'
          >
            <Form.Item
              label="角色："
            >
              <span>{userInfo.roleId?userInfo.roleId.name:'--'}</span>
            </Form.Item>
            <Form.Item
              name="name"
              label="用户名："
              rules={FormValidate({name: '用户名'})}
            >
              <Input 
                maxLength={20} 
                allowClear={true} 
                placeholder="用户名" 
              />
            </Form.Item>
            <Form.Item
              name="email"
              label="邮箱："
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
              label="手机号码："
              rules={FormValidate({type: 'phone', name: '手机号', emptyBool: true})}
            >
              <Input 
                maxLength={11} 
                allowClear={true} 
                placeholder="手机号码" 
              />
            </Form.Item>
            <Form.Item
              name="info"
              label="个性签名："
            >
              <TextArea rows={3} maxLength={100} placeholder="个性签名" />
            </Form.Item>
          </Form>
        </div>
      </Modal>
      <Modal
        title="修改密码"
        width={640}
        maskClosable={false}
        visible={pwdVisible}
        onOk={pwdHandleOk}
        confirmLoading={pwdLoading}
        onCancel={()=>{setPwdVisible(false)}}
      >
        <div className="person-info">
          <Form
            form={pwdForm}
            requiredMark={false}
            className='form-modal'
            validateTrigger='onBlur'
          >
            <Form.Item
              name="oldPwd"
              label="原密码"
              rules={FormValidate({type:'password',name: '原密码'})}
            >
              <Input.Password 
                type="password"
                maxLength={16}
                allowClear={true}
                placeholder="原密码"
              />
            </Form.Item>
            <Form.Item
              name="newPwd"
              label="新密码"
              rules={FormValidate({type:'password',name: '新密码'})}
            >
              <Input.Password 
                type="password"
                maxLength={16}
                allowClear={true}
                placeholder="新密码"
              />
            </Form.Item>
            <Form.Item
              name="confirPwd"
              label="确认密码"
              rules={[
                {
                  required: true,
                  message: '请输入确认密码',
                },
                {
                  min: 6, max: 16, message: `字符长度为6-16个字符`
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPwd') === value || value.length < 6) {
                      return Promise.resolve();
                    }
                    return Promise.reject('确认密码和新密码不一致');
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
          </Form>
        </div>
      </Modal>
      <Modal
        title="励志语句"
        width={640}
        maskClosable={false}
        visible={stateVisible}
        onOk={stateHandleOk}
        confirmLoading={stateLoading}
        onCancel={()=>{setStateVisible(false)}}
      >
        <div className="person-info">
          <Form
            form={stateForm}
            requiredMark={false}
            className='form-modal'
            validateTrigger='onBlur'
          >
            {
              statementArr.map(item=>{
                return <Form.Item
                  name={item.name}
                  key={item.name}
                  label={item.label}
                  rules={FormValidate({name: item.info})}
                >
                  <Input 
                    maxLength={40} 
                    allowClear={true} 
                    placeholder={item.info}
                  />
                </Form.Item>
              })
            }
          </Form>
        </div>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state: StoreState) => ({
  stateData: state
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setUserInfo: (userInfoObj:StoreState["userInfo"]) => {
    dispatch(setUserInfo(userInfoObj))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(BasicLayout)
