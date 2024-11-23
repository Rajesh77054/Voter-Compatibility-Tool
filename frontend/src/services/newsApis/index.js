// frontend/src/services/newsApis/index.js
import mediaStackApi from './mediaStackApi';
import newsApi from './newsApi';
import gnewsApi from './gnewsApi';
import politicoRssApi from './politicoRssApi';
import factcheckRssApi from './factcheckRssApi';
import reutersRssApi from './reutersRssApi';
import nprRssApi from './nprRssApi';

const newsApis = {
  mediaStack: mediaStackApi,
  newsApi: newsApi,
  gnews: gnewsApi,
  politicoRss: politicoRssApi,
  factcheckRss: factcheckRssApi,
  reutersRss: reutersRssApi,
  nprRss: nprRssApi
};

export default newsApis;