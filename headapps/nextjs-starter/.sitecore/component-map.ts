// Below are built-in components that are available in the app, it's recommended to keep them as is

import { BYOCWrapper, NextjsContentSdkComponent, FEaaSWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';

// end of built-in components
import * as VideoPlayer from 'src/components/VideoPlayer';
import * as ThemeSelector from 'src/components/ThemeSelector';
import * as SocialShare from 'src/components/SocialShare';
import * as SocialLinks from 'src/components/SocialLinks';
import * as SearchResults from 'src/components/SearchResults';
import * as PageTitleBanner from 'src/components/PageTitleBanner';
import * as NotificationBanner from 'src/components/NotificationBanner';
import * as NavTabs from 'src/components/NavTabs';
import * as NavTab from 'src/components/NavTab';
import * as Modal from 'src/components/Modal';
import * as MegaNavLinkList from 'src/components/MegaNavLinkList';
import * as MegaNavItem from 'src/components/MegaNavItem';
import * as MegaNav from 'src/components/MegaNav';
import * as LocationsListing from 'src/components/LocationsListing';
import * as Location from 'src/components/Location';
import * as LanguageSelector from 'src/components/LanguageSelector';
import * as FLRichText from 'src/components/FLRichText';
import * as FLNavigation from 'src/components/FLNavigation';
import * as FLLinkList from 'src/components/FLLinkList';
import * as FLContainer from 'src/components/FLContainer';
import * as CTAButton from 'src/components/CTAButton';
import * as ContentSection from 'src/components/ContentSection';
import * as ContentCard from 'src/components/ContentCard';
import * as CarouselSlide from 'src/components/CarouselSlide';
import * as Carousel from 'src/components/Carousel';
import * as Breadcrumb from 'src/components/Breadcrumb';
import * as ArticleDate from 'src/components/ArticleDate';
import * as AccordionPanel from 'src/components/AccordionPanel';
import * as Accordion from 'src/components/Accordion';
import * as Title from 'src/components/sxa/Title';
import * as RowSplitter from 'src/components/sxa/RowSplitter';
import * as RichText from 'src/components/sxa/RichText';
import * as Promo from 'src/components/sxa/Promo';
import * as PartialDesignDynamicPlaceholder from 'src/components/sxa/PartialDesignDynamicPlaceholder';
import * as PageContent from 'src/components/sxa/PageContent';
import * as Navigation from 'src/components/sxa/Navigation';
import * as LinkList from 'src/components/sxa/LinkList';
import * as Image from 'src/components/sxa/Image';
import * as ContentBlock from 'src/components/sxa/ContentBlock';
import * as Container from 'src/components/sxa/Container';
import * as ColumnSplitter from 'src/components/sxa/ColumnSplitter';

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCWrapper],
  ['FEaaSWrapper', FEaaSWrapper],
  ['Form', Form],
  ['VideoPlayer', { ...VideoPlayer }],
  ['ThemeSelector', { ...ThemeSelector }],
  ['SocialShare', { ...SocialShare }],
  ['SocialLinks', { ...SocialLinks }],
  ['SearchResults', { ...SearchResults }],
  ['PageTitleBanner', { ...PageTitleBanner }],
  ['NotificationBanner', { ...NotificationBanner }],
  ['NavTabs', { ...NavTabs }],
  ['NavTab', { ...NavTab }],
  ['Modal', { ...Modal }],
  ['MegaNavLinkList', { ...MegaNavLinkList }],
  ['MegaNavItem', { ...MegaNavItem }],
  ['MegaNav', { ...MegaNav }],
  ['LocationsListing', { ...LocationsListing }],
  ['Location', { ...Location }],
  ['LanguageSelector', { ...LanguageSelector }],
  ['FLRichText', { ...FLRichText }],
  ['FLNavigation', { ...FLNavigation }],
  ['FLLinkList', { ...FLLinkList }],
  ['FLContainer', { ...FLContainer }],
  ['CTAButton', { ...CTAButton }],
  ['ContentSection', { ...ContentSection }],
  ['ContentCard', { ...ContentCard }],
  ['CarouselSlide', { ...CarouselSlide }],
  ['Carousel', { ...Carousel }],
  ['Breadcrumb', { ...Breadcrumb }],
  ['ArticleDate', { ...ArticleDate }],
  ['AccordionPanel', { ...AccordionPanel }],
  ['Accordion', { ...Accordion }],
  ['Title', { ...Title }],
  ['RowSplitter', { ...RowSplitter }],
  ['RichText', { ...RichText }],
  ['Promo', { ...Promo }],
  ['PartialDesignDynamicPlaceholder', { ...PartialDesignDynamicPlaceholder }],
  ['PageContent', { ...PageContent }],
  ['Navigation', { ...Navigation }],
  ['LinkList', { ...LinkList }],
  ['Image', { ...Image }],
  ['ContentBlock', { ...ContentBlock }],
  ['Container', { ...Container }],
  ['ColumnSplitter', { ...ColumnSplitter }],
]);

export default componentMap;
