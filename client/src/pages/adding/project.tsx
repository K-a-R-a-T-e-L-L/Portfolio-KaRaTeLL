import useTokenValid from '@/hooks/useTokenValid/useTokenValid';
import style from './styles.module.scss';
import ButtonBack from '@/app/components/decorative/ButtonBack';
import ButtonExit from '@/app/components/decorative/ButtonExit';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import LoadingCirle from '@/app/components/decorative/LoadingCirle/LoadingCirle';
import useCookie from '@/hooks/useCookie/useCookie';
import CustomCursor from '@/app/components/decorative/CustomCursor';
import axios from 'axios';
import ProjectCard from '@/app/components/markup/ProjectCard';
import MessageErrorBlock from '@/app/components/decorative/MessageErrorBlock';
import MessageSuccessfullyBlock from '@/app/components/decorative/MessageSuccessfullyBlock';
import { GetServerSidePropsContext } from 'next';
import { ArrayURLImagesType, DataProjectCardType, ValuesInputsImagesType, ValuesInputsType } from '@/types.global';

const AddingProjects = ({ token }: { token: string }) => {

    //Получаем токен из файлов Cookie
    const { TokenCookie, deleteTokenCookie } = useCookie('token', '', '/', 600);
    //Проверяем токен на валидность
    const { TokenDecode, Loading, setLoading, MessageError, setMessageError } = useTokenValid(TokenCookie ? TokenCookie : token || '', deleteTokenCookie);

    const [ValueInputSkills, setValueInputSkills] = useState<string>('');
    const [ValueInputNumber, setValueInputNumber] = useState<string>('1');
    const [ValueInputColor, setValueInputColor] = useState<string>('#ffffff');
    const [ValuesInputsImages, setValuesInputsImages] = useState<ValuesInputsImagesType>({ img: [], icon: [] });
    const [ArrayURLImages, setArrayURLImages] = useState<ArrayURLImagesType>({ img: [], icon: [] });
    const [CheckedInputRadio, setCheckedInputRadio] = useState<number>(0);
    const [SuccessfullyAdded, setSuccessfullyAdded] = useState<string>('');
    const [ValuesInputs, setValuesInputs] = useState<ValuesInputsType>({
        name: '',
        link: '',
        description: '',
        positioningIcon: [{ x: 5, y: 5 }, { x: 30, y: 30 }, { x: 80, y: 8 }],
        number: "1",
        color: '255, 255, 255',
        skills: ['HTML', 'JS', 'CSS'],
        images: null,
        view: [],
    });
    const [DataProjectCard, setDataProjectCard] = useState<DataProjectCardType>({
        id: Date.now(),
        name: '',
        link: '',
        description: '',
        positioningIcon: [{ x: 5, y: 5 }, { x: 30, y: 30 }, { x: 80, y: 8 }],
        color: '255, 255, 255',
        skills: ['HTML', 'JS', 'CSS'],
        URLImages: {
            img: [],
            icon: []
        },
        view: [],
    });

    //Функция получения значения из поля ввода skills
    const handleValueInputSkills = (e: ChangeEvent<HTMLInputElement>) => {
        setValueInputSkills(e.target.value);
    };

    //Функция для записи номера фонового изображения, позиция которого сейчас редактируется
    const handleValueInputNumber = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^[123]*$/.test(value)) {
            setValueInputNumber(value);
            if (value !== '') handleValuesInputs(e, 'number');
        };
    };

    //Функция получения значения из поля ввода color
    const handleValueInputColor = (e: ChangeEvent<HTMLInputElement>) => {
        setValueInputColor(e.target.value);
    };

    //Функция получения файлов и их URL из полей images и icon
    const handleValuesInputImages = (e: ChangeEvent<HTMLInputElement>, type: string) => {
        const value: File[] = [];

        if (e.target.files && e.target.files?.length > 0) {
            for (let i = 0; i < Math.min(type === 'img' ? 10 : 3, e.target.files.length); i++) {
                value.push(e.target.files[i])
            };
        };

        if (value.length > 0) {
            setValuesInputsImages((prevState) => ({
                ...prevState,
                [type]: value
            }));

            const URLFiles = value.map((file: File) => {
                return URL.createObjectURL(file);
            });

            setArrayURLImages((prevState) => ({
                ...prevState,
                [type]: URLFiles
            }));
        };
    };

    //Функция получения активности input radio и записи его в поле view (для изображения отвечающего за превью)
    const handleValueInputView = (index: number) => {
        setCheckedInputRadio(index);
        setValuesInputs((prevState) => {
            let updateView = [...prevState.view];
            updateView = Array(ValuesInputsImages.img.length).fill(false);
            updateView[index] = true;
            return {
                ...prevState,
                view: updateView
            }
        });
    };

    //Функция получения значений из всех полей ввода в одну переменную
    const handleValuesInputs = (e: ChangeEvent<HTMLElement>, name: string, axis?: string) => {
        let value = '';
        if (typeof e !== 'undefined') value = (e.target as HTMLInputElement | HTMLTextAreaElement).value;

        if (name !== 'positioningIcon') {
            if (name === 'color') {
                setValuesInputs((prevState) => ({
                    ...prevState,
                    [name]: handleTransformationColor(value),
                }));
            }
            else {
                setValuesInputs((prevState) => ({
                    ...prevState,
                    [name]: value,
                }));
            };
        }
        else {
            setValuesInputs((prevState) => {
                const updatePositioning = [...prevState.positioningIcon];
                const index = parseFloat(prevState.number) - 1;
                updatePositioning[index] = {
                    ...updatePositioning[index],
                    [axis as string]: parseFloat(value)
                };
                return {
                    ...prevState,
                    positioningIcon: updatePositioning
                };
            });
        };
    };

    //Функция преобразования hex цвета в rgb
    const handleTransformationColor = (color: string) => {
        let value = color;
        value = value.replace(/^#/, '');
        const r = parseInt(value.substring(0, 2), 16);
        const g = parseInt(value.substring(2, 4), 16);
        const b = parseInt(value.substring(4, 6), 16);
        return `${r}, ${g}, ${b}`;
    };

    //Функция добавления значения из поля ввода skills в skills[]
    const handlePushSkill = useCallback(() => {
        if (ValueInputSkills !== '') {
            setValuesInputs((prevState) => {
                const updateSkills = [...prevState.skills];
                updateSkills.push(ValueInputSkills);
                return {
                    ...prevState,
                    skills: updateSkills
                };
            });
            setValueInputSkills('');
        };
    }, [ValueInputSkills]);

    //Функция для удаления скилла
    const handleDeleteSkill = (index: number) => {
        setValuesInputs((prevState) => {
            const currentSkills = [...prevState.skills];
            const updateSkills = currentSkills.filter((_, i) => i !== index);
            return {
                ...prevState,
                skills: updateSkills
            };
        });
    };

    //Функция добавления файлов в общуюю переменную
    const handleAddingImages = useCallback(() => {
        setCheckedInputRadio(0);
        if (ValuesInputsImages.img.length > 0) {
            setValuesInputs((prevState) => {
                let updateView = [...prevState.view];
                updateView = Array(ValuesInputsImages.img.length).fill(false);
                updateView[0] = true;
                return {
                    ...prevState,
                    images: ValuesInputsImages,
                    view: updateView
                }
            });
        }
        else if (ValuesInputsImages.icon.length > 0) {
            setValuesInputs((prevState) => ({
                ...prevState,
                images: ValuesInputsImages
            }));
        };
    }, [ValuesInputsImages]);

    const handleSaveProject = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('name', ValuesInputs.name);
        formData.append('link', ValuesInputs.link);
        formData.append('description', ValuesInputs.description);
        formData.append('color', ValuesInputs.color);

        formData.append('skills', JSON.stringify(ValuesInputs.skills));
        formData.append('positioningIcon', JSON.stringify(ValuesInputs.positioningIcon));
        formData.append('view', JSON.stringify(ValuesInputs.view));

        if (ValuesInputs.images?.img) {
            ValuesInputs.images.img.forEach((file) => {
                formData.append('img', file);
            });
        }

        if (ValuesInputs.images?.icon) {
            ValuesInputs.images.icon.forEach((file) => {
                formData.append('icon', file);
            });
        }

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_URL_SERVER}/api/projects/addingProject`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${TokenCookie ? TokenCookie : token}`
                }
            });
            if (res.data.name !== '' && res.data.name) {
                setSuccessfullyAdded(`Проект «${res.data.name}» успешно добавлен!`);
                setMessageError('');
            };
        }
        catch (error) {
            console.error(error);
            if (axios.isAxiosError(error)) {
                switch (error.response?.status) {
                    case 400:
                        setMessageError('Обязательные* поля ввода не должны быть пусты!!!');
                        break;
                    case 409:
                        setMessageError('Добавьте минимум 1 иконку и 1 изображение!!!');
                        break;
                    case 401:
                        setMessageError('Доступ запрещён!!!');
                        break;
                    default:
                        setMessageError('Ошибка сервера или отсутствует подключение к сети!!!');
                        break;
                };
            }
        }
        finally { setLoading(false) };
    };

    const handleFurther = () => {
        setSuccessfullyAdded('');
        setValuesInputs({
            name: '',
            link: '',
            description: '',
            positioningIcon: [{ x: 5, y: 5 }, { x: 30, y: 30 }, { x: 80, y: 8 }],
            number: "1",
            color: '255, 255, 255',
            skills: ['HTML', 'JS', 'CSS'],
            images: null,
            view: [],
        });
        setValueInputColor('#ffffff');
        setValueInputNumber('1');
        setValuesInputsImages({ img: [], icon: [] });
        setArrayURLImages({ img: [], icon: [] });
        setValueInputSkills('');
    };

    //Функция структуризации данных для передачи в компонент ProjectCard
    const handleDataProjectCard = useCallback(() => {
        const { ...data } = ValuesInputs;
        const updateData = {
            ...data,
            URLImages: ArrayURLImages,
            id: Date.now()
        };
        setDataProjectCard(updateData);
    }, [ArrayURLImages, ValuesInputs]);

    useEffect(() => { handleAddingImages() }, [handleAddingImages]);

    useEffect(() => {
        if (SuccessfullyAdded !== '') {
            const timeout = setTimeout(() => { handleFurther(); }, 3000);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [SuccessfullyAdded]);

    useEffect(() => { handleDataProjectCard(); }, [handleDataProjectCard]);

    useEffect(() => {
        const nextElement = document.getElementById('__next');
        if (nextElement) {
            nextElement.style.width = '100vw';
            nextElement.style.height = '100vh';
            nextElement.style.maxWidth = '1488px';
            nextElement.style.maxHeight = '740px';
        }
    }, []);

    useEffect(() => {
        const inputSkills = document.getElementById('skills');
        if (inputSkills) {
            const handleKeyPress = (e: KeyboardEvent) => {
                if (e.key === 'Enter') {
                    if (ValueInputSkills !== '') handlePushSkill();
                };
            };

            inputSkills.addEventListener('keypress', handleKeyPress);

            return () => {
                inputSkills.removeEventListener('keypress', handleKeyPress);
            };
        };
    }, [ValueInputSkills, handlePushSkill]);

    useEffect(() => {
        const bodyDocument = document.body;
        if (bodyDocument) {
            bodyDocument.style.margin = "0";
        };
    }, []);

    return (
        <>
            <div className={style.adding_projects}>
                <ButtonBack />
                <ButtonExit />
                <CustomCursor />
                {Loading ? (
                    <LoadingCirle size='10' />
                ) : (
                    TokenDecode?.role === process.env.NEXT_PUBLIC_ROLE ? (
                        SuccessfullyAdded ? (
                            <MessageSuccessfullyBlock successfullyMessage={SuccessfullyAdded} buttonText={'Дальше'} func={handleFurther} />
                        ) : (
                            <section className={style.adding_projects__content}>
                                <form className={style.content__project_edit_form} autoComplete='off'>
                                    <div className={style.project_edit_form__one_block}>
                                        <div className={style.one_block__name}>
                                            <label htmlFor="name">Название *</label>
                                            <input type="text" id='name' placeholder='_' value={ValuesInputs.name} onChange={(e) => handleValuesInputs(e, 'name')} />
                                        </div>
                                        <div className={style.one_block__link}>
                                            <label htmlFor="link">Ссылка *</label>
                                            <input type="text" id='link' value={ValuesInputs.link} placeholder='_' onChange={(e) => handleValuesInputs(e, 'link')} />
                                        </div>
                                        <div className={style.one_block__images}>
                                            <label htmlFor="images-carousel" data-interactive="true" tabIndex={0}>
                                                Выберите или перетащите изображения и установите одно из них в качестве превью *
                                                <div>
                                                    {ArrayURLImages?.img?.map((el, i) => {
                                                        return (
                                                            <div key={i} style={{ backgroundImage: `URL(${el})` }}>
                                                                <input type="radio" name='view-img' checked={CheckedInputRadio === i} onChange={() => handleValueInputView(i)} />
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </label>
                                            <input type="file" id='images-carousel' onChange={(e) => handleValuesInputImages(e, 'img')} accept='image/*' multiple />
                                        </div>
                                        <div className={style.one_block__position}>
                                            <div>
                                                <input type='text' id='input-number' minLength={1} maxLength={1} value={ValueInputNumber} onChange={(e) => { handleValueInputNumber(e); }} />
                                            </div>
                                            <div>
                                                <input onChange={(e) => handleValuesInputs(e, 'positioningIcon', 'y')} defaultValue={ValuesInputs.positioningIcon[1].y} min={-100} max={100} type="range" id='images' data-interactive="true" />
                                                <input onChange={(e) => handleValuesInputs(e, 'positioningIcon', 'x')} defaultValue={ValuesInputs.positioningIcon[1].x} min={-100} max={100} type="range" id='images' data-interactive="true" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={style.project_edit_form__two_block}>
                                        <div className={style.two_block__description}>
                                            <label htmlFor="description">Описание *</label>
                                            <textarea name="" id="description" value={ValuesInputs.description} placeholder='_' onChange={(e) => handleValuesInputs(e, 'description')}></textarea>
                                        </div>
                                        <div className={style.two_block__icon_background}>
                                            <label htmlFor="icon-background" data-interactive="true" tabIndex={0}>
                                                Выберите или перетащите иконки для карточки *
                                                <div>
                                                    {ArrayURLImages?.icon?.map((el, i) => {
                                                        return (
                                                            <div key={i} style={{ backgroundImage: `URL(${el})` }}></div>
                                                        )
                                                    })}
                                                </div>
                                            </label>
                                            <input type="file" id='icon-background' onChange={(e) => handleValuesInputImages(e, 'icon')} accept='image/*' multiple maxLength={3} />
                                        </div>
                                        <div className={style.two_block__color}>
                                            <input type="color" id='color' value={ValueInputColor} data-interactive="true" onChange={(e) => { handleValuesInputs(e, 'color'); handleValueInputColor(e) }} />
                                            <input type="text" id='color' placeholder='#XXXXXX' value={ValueInputColor} readOnly />
                                        </div>
                                        <div className={style.two_block__skills}>
                                            <label htmlFor="skills">Навыки</label>
                                            <div className={style.skills__new_skill}>
                                                <input type="text" id='skills' value={ValueInputSkills} onChange={(e) => handleValueInputSkills(e)} placeholder='_' maxLength={30} />
                                                <button type='button' data-interactive="true" onClick={handlePushSkill}></button>
                                            </div>
                                            <div className={style.skills__skill}>
                                                {ValuesInputs.skills.map((el, i) => {
                                                    return (
                                                        <div key={i}>
                                                            {el}
                                                            <button type='button' data-interactive="true" onClick={() => handleDeleteSkill(i)}></button>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                        <button className={style.two_block__submit} type='button' onClick={handleSaveProject} data-interactive="true">Сохранить</button>
                                    </div>
                                </form>
                                <ProjectCard data={DataProjectCard} edit={true} />
                            </section>
                        )
                    ) : (
                        <h1 style={{ color: 'white' }}>Вы не имеете доступа к этой странице!!!</h1>
                    )
                )}
                {MessageError && (<MessageErrorBlock MessageError={MessageError} setMessageError={setMessageError} />)}
            </div>
        </>
    );
};


export async function getServerSideProps(context: GetServerSidePropsContext) {
    const token = context.req.cookies.token || '';

    return {
        props: {
            token,
        },
    };
};

export default AddingProjects;