import React, { useState, useEffect } from 'react';
import { Modal, Select, Input, Button, FloatButton, Flex, Card, Popconfirm, message } from 'antd';
import { FacebookEmbed, InstagramEmbed, LinkedInEmbed, PinterestEmbed, XEmbed, YouTubeEmbed } from 'react-social-media-embed';
import { PlusOutlined,SettingOutlined,EditOutlined,DeleteOutlined } from '@ant-design/icons';
const { Option } = Select;
const { TextArea } = Input;

const FloatAddButton = ({ emitter }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [embedCode, setEmbedCode] = useState('');
  const [previewContent, setPreviewContent] = useState(null);
  const [isValid, setIsValid] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setPreviewContent(null);
    setSelectedPlatform(null);
    setEmbedCode('');
    setIsModalVisible(false);
  };

  const handleSelectChange = (value) => {
    setSelectedPlatform(value);
  };

  const handleEmbedCodeChange = (e) => {
    setEmbedCode(e.target.value);
  };

  useEffect(() => {
    generatePreview();
  }, [embedCode, selectedPlatform]);

  const generatePreview = () => {
    const embedUrl = embedCode.trim();
    let preview = null;
    let valid = false;

    switch (selectedPlatform) {
      case 'Facebook':
        if (/^https:\/\/www\.facebook\.com/.test(embedUrl)) {
          preview = <FacebookEmbed url={embedUrl} />;
          valid = true;
        }
        break;
      case 'Instagram':
        if (/^https:\/\/www\.instagram\.com/.test(embedUrl)) {
          preview = <InstagramEmbed url={embedUrl} />;
          valid = true;
        }
        break;
      case 'LinkedIn':
        if (/^https:\/\/www\.linkedin\.com/.test(embedUrl)) {
          preview = <LinkedInEmbed url={embedUrl} />;
          valid = true;
        }
        break;
      case 'Pinterest':
        if (/^https:\/\/www\.pinterest\.com/.test(embedUrl)) {
          preview = <PinterestEmbed url={embedUrl} />;
          valid = true;
        }
        break;
      case 'X':
        if (/^https:\/\/twitter\.com/.test(embedUrl)) {
          preview = <XEmbed url={embedUrl} />;
          valid = true;
        }
        break;
      case 'YouTube':
        if (/^https:\/\/www\.youtube\.com/.test(embedUrl)) {
          preview = <YouTubeEmbed url={embedUrl} />;
          valid = true;
        }
        break;
      default:
        break;
    }

    setPreviewContent(preview);
    setIsValid(valid);
  };

  const handlePost = async () => {
    if (isValid) {
      try {
        const response = await fetch('http://localhost:3010/add/SocialMedia', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            platform: selectedPlatform,
            url: embedCode
          })
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          handleOk();
          emitter(true);
        } else {
          throw new Error('Network response was not ok');
        }

      } catch (error) {
        console.error('There was an error posting the data!', error);
      }
    }
  };

  return (
    <>
      <FloatButton icon={<PlusOutlined />} type="primary" onClick={showModal}>
        Open Modal
      </FloatButton>
      <Modal
        title="Social Media Embed"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handlePost} disabled={!isValid}>
            Post
          </Button>

        ]}
      >
        <Select
          placeholder="Select a platform"
          style={{ width: '100%', marginBottom: '16px' }}
          onChange={handleSelectChange}
        >
          <Option value="Facebook">Facebook</Option>
          <Option value="Instagram">Instagram</Option>
          <Option value="LinkedIn">LinkedIn</Option>
          <Option value="Pinterest">Pinterest</Option>
          <Option value="X">X</Option>
          <Option value="YouTube">YouTube</Option>
        </Select>
        <TextArea placeholder="Embed code" rows={4} value={embedCode} onChange={handleEmbedCodeChange} style={{ marginBottom: '16px' }} />

        {previewContent}
      </Modal>
    </>
  );
};

const SocialMedia = () => {
  const [occurUpdate, setOccurUpdate] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    async function update() {
      const response = await fetch('http://localhost:3010/SocialMedia');
      const data = await response.json();
      console.log(data);
      setData(data);
    }
    console.log("Item Refreshed");
    update();
  }, [occurUpdate]);

  const renderEmbed = (item) => {
    const { platform, url } = item;
    switch (platform) {
      case 'Facebook':
        return <FacebookEmbed url={url} />;
      case 'Instagram':
        return <InstagramEmbed  url={url} />;
      case 'LinkedIn':
        return <LinkedInEmbed url={url} />;
      case 'Pinterest':
        return <PinterestEmbed url={url} />;
      case 'X':
        return <XEmbed url={url} />;
      case 'YouTube':
        return <YouTubeEmbed url={url} />;
      default:
        return null;
    }
  };


  const handleDelete = async (item) => {
    try {
      const response = await fetch('http://localhost:3010/SocialMedia', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });
  
      if (response.ok) {
        console.log('Card is deleted');
        setOccurUpdate(true);
        message.success('Card is Deleted');
      } else {
        console.error('Failed to delete card:', response.statusText);
        message.error('Failed to delete card');
      }
    } catch (error) {
      console.error('An error occurred while deleting card:', error);
      message.error('An error occurred while deleting card');
    }
  };
  

  return (
    <>
      <FloatAddButton emitter={setOccurUpdate} />
      <div style={{overflow:'hidden',}}>
      <Flex wrap gap="small">
      {data.map((item) => (
        
      <Card cover={
        <span key={item._id} style={{overflow:'scroll',scrollbarWidth:'none',maxHeight:400}} >
            {renderEmbed(item)}
          </span>
      }
      
      actions={[
        <EditOutlined key="edit" />,
        <Popconfirm
          key="delete"
          title="Are you sure to delete this card?"
          onConfirm={() => handleDelete(item)}
          okText="Yes"
          cancelText="No"
        >
          <DeleteOutlined style={{ color: 'red' }} />
        </Popconfirm>
      ]}
      >
        </Card>
        ))}
      </Flex>
        
      </div>
    </>
  );
}

export default SocialMedia;
