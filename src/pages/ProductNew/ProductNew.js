import React, { useEffect, useState } from "react";
import { Layout } from "../../shared/layout";
import {
    Input,
    Tabs,
    Toggle,
    select as Select,
    Textarea,
    Link,
    Button,
} from "@komus/design";
import { GallaryImage } from "../../shared/ui/GallaryImage";
import CloseIcon from '../../assets/close.svg';
import "./style.css";
import { httpService } from '../../shared/service/service';

export const ProductNew = () => {
    const [activeKey, setActiveKey] = useState("1");
    const [newImages, setNewImages] = useState([]);
    const onChange = value => setActiveKey(value);

    const [editingProduct, setEditingProduct] = useState({
        name: "",
        images: [],
        description: "",
        category: "",
        price: "",
        available: "",
        info: {
            stock: []
        }
    });

    const [fileList, setFileList] = useState([
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          uid: '-2',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          uid: '-3',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          uid: '-4',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        }
      ]);
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
    const customRequest = async ({ file, onSuccess, onError, onProgress }) => {
        const fmData = new FormData();
        const config = {
            headers: { "content-type": "multipart/form-data" },
        };
        fmData.append("file", file);

        try {
            const res = await httpService(
                'POST',
                "upload_photo",
                '',
                fmData,
                config
            );

            if (res.status === 200) {
                onSuccess(res.data, file);
                setNewImages(prevImages => [
                    ...prevImages,
                    {
                        id: res.data.id,
                        url: res.data.url
                    }
                ]);
            } else {
                onError(new Error('Error in upload'), {
                    uid: file.uid,
                });
                console.error(`Error uploading image: ${res.status}`);
            }
        } catch (error) {
            onError(new Error('Error in upload'), {
                uid: file.uid,
            });
            console.error(`Error uploading image: ${error}`);
        }
    }
    const deleteImage = imageId => {
        setEditingProduct(prevEditingProduct => ({
            ...prevEditingProduct,
            images: prevEditingProduct.images.filter(image => image.id !== imageId),
        }));
    };

    useEffect(() => {
        if (editingProduct.info.stock.length === 0) {
            const newEditingProduct = { ...editingProduct };
            newEditingProduct.info.stock.push({ id: Number(Date.now()), variant: "", count: 0 });
            setEditingProduct(newEditingProduct);
        }
    }, [])

    const opts = [
        { label: "first option", value: 1 },
        { label: "second option", value: 2 },
        { label: "third option", value: 3 },
    ];

    const handleFieldChange = (field, value) => {
        setEditingProduct(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleVariantChange = (index, key, value) => {
        const newEditingProduct = { ...editingProduct };
        newEditingProduct.info.stock[index][key] = value;
        setEditingProduct(newEditingProduct);
    };

    const addNewVariant = () => {
        const newEditingProduct = { ...editingProduct };
        newEditingProduct.info.stock.push({ id: Number(Date.now()), variant: "", count: 0 });
        setEditingProduct(newEditingProduct);
    };

    const deleteVariant = (id, stockItemID) => {
        const newEditingProduct = { ...editingProduct };
        newEditingProduct.info.stock = newEditingProduct.info.stock.filter(stockItem => stockItem.id !== stockItemID);
        setEditingProduct(newEditingProduct);
    };

    const apiCreateProduct = (data) => {
        return new Promise((resolve, reject) => {
            // Имитация задержки сети
            setTimeout(() => {
                console.log(`Created product with data:`, data);
                resolve({ status: 200 });
            }, 2000);
        });
    };

    const makeMainImage = imageUrl => {
        setEditingProduct(prevProduct => ({
            ...prevProduct,
            image: imageUrl,
        }));
    };

    const handleSave = async () => {
        try {
            const response = await apiCreateProduct(editingProduct);
            if (response.status === 200) {
                // Если создание прошло успешно - очистим форму
                setEditingProduct({
                    name: "",
                    images: [],
                    description: "",
                    category: "",
                    price: "",
                    available: "",
                    info: {
                        stock: []
                    }
                });
            } else {
                // Обработайте ошибки, возвращаемые сервером
                console.error(`Error creating product: ${response.status}`);
            }
        } catch (error) {
            // Обработайте ошибки сети или другие ошибки
            console.error(`Error creating product: ${error}`);
        }
    };

    const resetChanges = () => {
        setEditingProduct(JSON.parse(JSON.stringify(editingProduct)));
    };

    const submitChanges = () => {
        console.log(editingProduct)
    }

    return (
        <Layout>
            <div className="product-add-page">

                <GallaryImage
                    prevMainImage={editingProduct.image}
                    images={editingProduct.images}
                    newImages={newImages}
                    mainImage={editingProduct.image}
                    deleteImage={deleteImage}
                    makeMainImage={makeMainImage}
                    fileList={fileList}
                    customRequest={customRequest}
                    handleChange={handleChange}
                />

                <div className="product-add-page-wrapper">
                    <h2 className="product-add-page-title">{editingProduct.name || "Новый товар"}</h2>
                    <Tabs activeKey={activeKey} onChange={onChange} style={{ width: '100%' }}>
                        <Tabs.TabPane tab="Общая информация" key="1">
                            <div className="form">
                                <Input placeholder="Название товара"
                                    value={editingProduct.name}
                                    onChange={e => handleFieldChange('name', e.target.value)} />
                                {/* <div>
                                    <label>Категория</label>
                                    <Select
                                        value={editingProduct.category}
                                        options={opts}
                                        onChange={option => handleFieldChange('category', option.value)}
                                    />
                                </div> */}
                                <div>
                                    <label>Цена</label>
                                    <Input value={editingProduct.price}
                                        onChange={e => handleFieldChange('price', e.target.value)} />
                                </div>
                                <div>
                                    <label>Описание</label>
                                    <Textarea value={editingProduct.description}
                                        onChange={e => handleFieldChange('description', e)}>Описание</Textarea>
                                </div>
                                <Button type="primary" onClick={handleSave}>Добавить товар</Button>
                            </div>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Параметры" key="2">
                            <div className="form form-2">
                                <div className='product-variants-wrapper'>
                                    {
                                        editingProduct.info.stock && editingProduct.info.stock.map((stockItem, index) => (
                                            <div key={index} className='product-variants'>
                                                <div className='product-variant-item product-variant-item-var'>
                                                    <label>Вариант</label>
                                                    <Input value={stockItem.variant} onChange={e => handleVariantChange(index, 'variant', e.target.value)} />
                                                </div>
                                                <div className='product-variant-item product-variant-item-size'>
                                                    <label>Количество</label>
                                                    <Input value={stockItem.count} onChange={e => handleVariantChange(index, 'count', e.target.value)} />
                                                </div>
                                                <img src={CloseIcon} alt={'close-icon'} className='product-variant-item-close-icon' onClick={() => deleteVariant(editingProduct.id, stockItem.id)} />
                                            </div>
                                        ))
                                    }
                                    <Link onClick={addNewVariant}>Добавить ещё</Link>
                                </div>
                                <div className='product-edit-action-bar'>
                                    <Button onClick={submitChanges}>Сохранить</Button>
                                    <Link onClick={resetChanges}>Отменить изменения</Link>
                                </div>
                            </div>
                        </Tabs.TabPane>
                    </Tabs>
                </div>
            </div>
        </Layout>
    );
};