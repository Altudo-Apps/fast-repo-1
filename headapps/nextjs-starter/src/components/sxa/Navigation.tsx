import { useState, JSX } from 'react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { Fields, NavigationProps } from 'src/core/molecules/NavigationItem/Navigaton.type';
import { NavigationList } from 'src/core/molecules/NavigationItem/NavigationList';
import HeaderNavigation from 'src/core/molecules/NavigationItem/HeaderNavigation';

export const Default = (props: NavigationProps): JSX.Element => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const { page } = useSitecore();

  const styles = props.params.styles || '';
  const id = props.params.RenderingIdentifier || null;

  if (!Object.values(props.fields).length) {
    return (
      <div className={`component navigation ${styles}`} id={id ? id : undefined}>
        <div className="component-content">[Navigation]</div>
      </div>
    );
  }

  const handleToggleMenu = (event?: React.MouseEvent<HTMLElement>, flag?: boolean): void => {
    if (event && page.mode.isEditing) {
      event.preventDefault();
    }

    if (flag !== undefined) {
      setIsOpenMenu(flag);
    } else {
      setIsOpenMenu(!isOpenMenu);
    }
  };

  const list = Object.values(props.fields)
    .filter((element) => element)
    .map((element: Fields, key: number) => (
      <NavigationList
        key={`${key}${element.Id}`}
        fields={element}
        handleClick={(event: React.MouseEvent<HTMLElement>) => handleToggleMenu(event, false)}
        relativeLevel={1}
      />
    ));

  return (
    <div className={`component navigation ${styles} flex flex-col`} id={id ? id : undefined}>
      <HeaderNavigation isOpenMenu={isOpenMenu} setIsOpenMenu={setIsOpenMenu} list={list} />
    </div>
  );
};
