import { FaFeatherAlt, FaRegUser, FaPlus } from 'react-icons/fa';
import { HiOutlineUser, HiUserAdd, HiOutlineUserGroup } from 'react-icons/hi';
import { BiPen, BiPlug } from 'react-icons/bi';
import * as Icons from "react-icons/bi";
import { RiSettings3Line } from 'react-icons/ri';
import { AiOutlineLock } from 'react-icons/ai';
import React, { useState, useContext, useEffect, useRef } from 'react';
import 'simplebar/dist/simplebar.min.css'
import CacheContext from "@/components/contexts/CacheContext";
import AppModal from "@/components/klaudsolcms/AppModal";
import CollectionTypeBody from "@/components/klaudsolcms/modals/modal_body/CollectionTypeBody";
import { useRouter } from 'next/router'

// sidebar nav config
import FullSidebar from './sidebar/FullSidebar';
import CollapsedSidebar from './sidebar/CollapsedSidebar';
import { SET_COLLAPSE } from '@/lib/actions';
import RootContext from '@/components/contexts/RootContext';
import { useCapabilities } from '@/components/hooks';
import { writeSettings, writeContentTypes, readUsers,  readGroups, writeContents } from "@/lib/Constants";
import { loadEntityTypes } from '@/components/reducers/actions';
import pluginMenus from '@/plugin-menus.json';

const AppSidebar = () => {

  const router = useRouter();
  const capabilities = useCapabilities();
  const formRef = useRef();
  const { state: rootState, dispatch: rootDispatch } = useContext(RootContext);

  const cache = useContext(CacheContext);
  const { firstName = null, lastName = null, defaultEntityType = null } = cache ?? {};
  const [isCollectionTypeBodyVisible, setCollectionTypeBodyVisible] = useState(false);

  const onModalSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
      setCollectionTypeBodyVisible(false);
    }
  };

  const pluginMenuLinks = pluginMenus.menus.map(plugin => {
    const PluginMenuIcon = Icons[plugin.icon] ?? "BiPlug";
    return {
      title: plugin.title,
      path: plugin.link,
      icon: <PluginMenuIcon className='sidebar_button_icon'/>
  }});

  const entityTypeLinks = (capabilities.includes(writeContents) ? rootState.entityTypes.map(type => ({
      title: type.entity_type_name,
      path: `/admin/content-manager/${type.entity_type_slug}`,
      icon: <BiPen className='sidebar_button_icon'/>
    })) : 
    []
  );

  const sidebarButtons = [
    (capabilities.includes(writeContentTypes) && {
      multiple: true,
      title: "Content Type Editor",
      path: `/admin/content-type-builder/`,
      icon: <FaFeatherAlt className='sidebar_button_icon'/>,
      subItems: [
        ...rootState.entityTypes.map(type => ({
        subTitle: `${type.entity_type_name} Type`,
        subPath: `/admin/content-type-builder/${type.entity_type_slug}`
      })),
      {
        subTitle: 'New Type',
        subPath: '#',
        subIcon:  <FaPlus className="content_create_icon" />,
        onClick: () => {setCollectionTypeBodyVisible(true)},
        highlight: false
      }
    ]
    }),
    {
      title: "Profile",
      path: "/admin/me",
      icon: <FaRegUser className='sidebar_button_icon'/>
    },
    (capabilities.includes(writeSettings) ? {
      title: "Settings",
      path: "/admin/settings",
      icon: <RiSettings3Line className='sidebar_button_icon'/>
    }:null),
    {
      multiple: true,
      title: "Admin",
      path: `/admin`,
      icon: <AiOutlineLock className='sidebar_button_icon'/>,
      subItems:[capabilities.includes(readUsers) ?
                {subTitle:"Users", 
                 subIcon:<HiOutlineUser className='sidebar_button_icon'/>,
                 subPath:"/admin/users" 
                }: null,
                capabilities.includes(readUsers) ?
                {subTitle:"Pending Users", 
                 subIcon:<HiUserAdd className='sidebar_button_icon'/>,
                 subPath:"/admin/users/pending" 
                }: null,
                // capabilities.includes(readGroups)
                false ? 
                {subTitle:"Groups",
                 subIcon:<HiOutlineUserGroup className='sidebar_button_icon'/>,
                 subPath:"/admin/groups"
                } : null].filter(item => item),
    }
  ].filter(item => item);

    useEffect(() => { 
     rootState.collapse === null ? rootDispatch({type: SET_COLLAPSE, payload: true}) : null
    }, [rootState.collapse]);

    useEffect(() => { 
      (async () => {
        await loadEntityTypes({rootState, rootDispatch});
      })();
    }, [rootState]);
  
  return (
    <>
     {rootState.collapse && 
      <CollapsedSidebar 
        entityTypeLinks={entityTypeLinks} 
        sidebarButtons={[...entityTypeLinks, ...pluginMenuLinks, ...sidebarButtons]} 
        firstName={firstName} 
        lastName={lastName} 
        defaultEntityType={defaultEntityType} 
        router={router} 
        setCollapse={e => rootDispatch({type: SET_COLLAPSE, payload: e})}/> 
     }  
     
     {!rootState.collapse && 
        <FullSidebar 
          sidebarButtons={[...entityTypeLinks, ...pluginMenuLinks, ...sidebarButtons]} 
          firstName={firstName} 
          lastName={lastName} 
          defaultEntityType={defaultEntityType} 
          router={router} 
          setCollapse={e => rootDispatch({type: SET_COLLAPSE, payload: e})} />
     }
      <AppModal
        show={isCollectionTypeBodyVisible}
        onClose={() => setCollectionTypeBodyVisible(false)}
        onClick={onModalSubmit}
        modalTitle="Create a collection type"
        buttonTitle="Continue"
      >
        <CollectionTypeBody formRef={formRef} />
      </AppModal>
    </>
  )
}

export default React.memo(AppSidebar)
