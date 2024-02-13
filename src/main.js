import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import App from './App.vue';
import router from './router';

import PrimeVue from 'primevue/config';
import AutoComplete from 'primevue/autocomplete';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Avatar from 'primevue/avatar';
import AvatarGroup from 'primevue/avatargroup';
import Badge from 'primevue/badge';
import BadgeDirective from 'primevue/badgedirective';
import Button from 'primevue/button';
import Breadcrumb from 'primevue/breadcrumb';
import Calendar from 'primevue/calendar';
import Card from 'primevue/card';
import CascadeSelect from 'primevue/cascadeselect';
import Carousel from 'primevue/carousel';
import Chart from 'primevue/chart';
import Checkbox from 'primevue/checkbox';
import Chip from 'primevue/chip';
import Chips from 'primevue/chips';
import ColorPicker from 'primevue/colorpicker';
import Column from 'primevue/column';
import ConfirmDialog from 'primevue/confirmdialog';
import ConfirmPopup from 'primevue/confirmpopup';
import ConfirmationService from 'primevue/confirmationservice';
import ContextMenu from 'primevue/contextmenu';
import DataTable from 'primevue/datatable';
import DataView from 'primevue/dataview';
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions';
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';
import Dropdown from 'primevue/dropdown';
import Fieldset from 'primevue/fieldset';
import FileUpload from 'primevue/fileupload';
import Galleria from 'primevue/galleria';
import Image from 'primevue/image';
import InlineMessage from 'primevue/inlinemessage';
import Inplace from 'primevue/inplace';
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputtext';
import TextArea from 'primevue/textarea';
import InputMask from 'primevue/inputmask';
import InputNumber from 'primevue/inputnumber';
import Knob from 'primevue/knob';
import Listbox from 'primevue/listbox';
import MegaMenu from 'primevue/megamenu';
import Menu from 'primevue/menu';
import Menubar from 'primevue/menubar';
import Message from 'primevue/message';
import MultiSelect from 'primevue/multiselect';
import OrderList from 'primevue/orderlist';
import OrganizationChart from 'primevue/organizationchart';
import OverlayPanel from 'primevue/overlaypanel';
import Paginator from 'primevue/paginator';
import Panel from 'primevue/panel';
import PanelMenu from 'primevue/panelmenu';
import Password from 'primevue/password';
import PickList from 'primevue/picklist';
import ProgressBar from 'primevue/progressbar';
import Rating from 'primevue/rating';
import RadioButton from 'primevue/radiobutton';
import Ripple from 'primevue/ripple';
import SelectButton from 'primevue/selectbutton';
import ScrollPanel from 'primevue/scrollpanel';
import ScrollTop from 'primevue/scrolltop';
import Skeleton from 'primevue/skeleton';
import Slider from 'primevue/slider';
import Sidebar from 'primevue/sidebar';
import SpeedDial from 'primevue/speeddial';
import SplitButton from 'primevue/splitbutton';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import Steps from 'primevue/steps';
import StyleClass from 'primevue/styleclass';
import TabMenu from 'primevue/tabmenu';
import TieredMenu from 'primevue/tieredmenu';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import Toolbar from 'primevue/toolbar';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Tag from 'primevue/tag';
import Timeline from 'primevue/timeline';
import ToggleButton from 'primevue/togglebutton';
import Tooltip from 'primevue/tooltip';
import Tree from 'primevue/tree';
import TreeSelect from 'primevue/treeselect';
import TreeTable from 'primevue/treetable';
import TriStateCheckbox from 'primevue/tristatecheckbox';
import Editor from 'primevue/editor';

import BlockViewer from '@/components/BlockViewer.vue';

import { uppercaseDirective } from './directives/uppercase';
import { lowercaseDirective } from './directives/lowercase';
import { requiredDirective } from './directives/required';

import UWPageBase from '@/components/layout/UWPageBase.vue';
import UWPageCrud from '@/components/layout/UWPageCrud.vue';
import UWForm from '@/components/layout/UWForm.vue';
import UWInput from '@/components/layout/UWInput.vue';
import UWTextArea from '@/components/layout/UWTextArea.vue';
import UWSeletor from '@/components/UWSeletor.vue';
import UWMultiSeletor from '@/components/UWMultiSeletor.vue';
import UWFieldSet from '@/components/layout/UWFieldSet.vue';
import UWPickList from '@/components/UWPickList.vue';
import UWInputMask from '@/components/UWInputMask.vue';
import UWCalendar from '@/components/UWCalendar.vue';
import UWParceiroLocal from '@/components/UWParceiroLocal.vue';  
import UWCurrency from '@/components/UWCurrency.vue';  

import '@/assets/styles.scss';

const app = createApp(App);

app.use(PrimeVue, {
    ripple: true,
    inputStyle: 'outlined',
    locale: {
        "startsWith": "Começa com",
        "contains": "Contém",
        "notContains": "Não contém",
        "endsWith": "Termina com",
        "equals": "Igual",
        "notEquals": "Diferente",
        "noFilter": "Sem Filtro",
        "filter": "Filtro",
        "lt": "Menor que",
        "lte": "Menor ou igual a",
        "gt": "Maior que",
        "gte": "Maior ou igual a",
        "dateIs": "Data é",
        "dateIsNot": "Data não é",
        "dateBefore": "Data antes de",
        "dateAfter": "Data depois de",
        "custom": "Personalizado",
        "clear": "Limpar",
        "apply": "Aplicar",
        "matchAll": "Corresponder Todos",
        "matchAny": "Corresponder Qualquer",
        "addRule": "Adicionar Regra",
        "removeRule": "Remover Regra",
        "accept": "Sim",
        "reject": "Não",
        "choose": "Escolher",
        "upload": "Enviar",
        "cancel": "Cancelar",
        "completed": "Concluído",
        "pending": "Pendente",
        "fileSizeTypes": ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB" ],
        "dayNames": ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"],
        "dayNamesShort": ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
        "dayNamesMin": ["D", "S", "T", "Q", "Q", "S", "S"],
        "monthNames": ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
        "monthNamesShort": ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        "chooseYear": "Escolher Ano",
        "chooseMonth": "Escolher Mês",
        "chooseDate": "Escolher Data",
        "prevDecade": "Década Anterior",
        "nextDecade": "Próxima Década",
        "prevYear": "Ano Anterior",
        "nextYear": "Próximo Ano",
        "prevMonth": "Mês Anterior",
        "nextMonth": "Próximo Mês",
        "prevHour": "Hora Anterior",
        "nextHour": "Próxima Hora",
        "prevMinute": "Minuto Anterior",
        "nextMinute": "Próximo Minuto",
        "prevSecond": "Segundo Anterior",
        "nextSecond": "Próximo Segundo",
        "am": "AM",
        "pm": "PM",
        "today": "Hoje",
        "now": "Agora",
        "weekHeader": "Sem",
        "firstDayOfWeek": 0,
        "showMonthAfterYear": false,
        "dateFormat": "dd/MM/yy",
        "weak": "Fraco",
        "medium": "Médio",
        "strong": "Forte",
        "passwordPrompt": "Digite uma senha",
        "emptyFilterMessage": "Nenhum resultado encontrado",
        "searchMessage": "Existem {0} resultados disponíveis",
        "selectionMessage": "{0} itens selecionados",
        "emptySelectionMessage": "Nenhum item selecionado",
        "emptySearchMessage": "Nenhum resultado encontrado",
        "emptyMessage": "Nenhuma opção disponível",
        "aria": {
          "trueLabel": "Verdadeiro",
          "falseLabel": "Falso",
          "nullLabel": "Não Selecionado",
          "star": "1 estrela",
          "stars": "{star} estrelas",
          "selectAll": "Todos os itens selecionados",
          "unselectAll": "Todos os itens desmarcados",
          "close": "Fechar",
          "previous": "Anterior",
          "next": "Próximo",
          "navigation": "Navegação",
          "scrollTop": "Rolar para o Topo",
          "moveTop": "Mover para o Topo",
          "moveUp": "Mover para Cima",
          "moveDown": "Mover para Baixo",
          "moveBottom": "Mover para o Final",
          "moveToTarget": "Mover para o Destino",
          "moveToSource": "Mover para a Origem",
          "moveAllToTarget": "Mover Todos para o Destino",
          "moveAllToSource": "Mover Todos para a Origem",
          "pageLabel": "Página {page}",
          "firstPageLabel": "Primeira Página",
          "lastPageLabel": "Última Página",
          "nextPageLabel": "Próxima Página",
          "previousPageLabel": "Página Anterior",
          "rowsPerPageLabel": "Linhas por página",
          "jumpToPageDropdownLabel": "Ir para a Página",
          "jumpToPageInputLabel": "Ir para a Página",
          "selectRow": "Linha Selecionada",
          "unselectRow": "Linha Desmarcada",
          "expandRow": "Expandir Linha",
          "collapseRow": "Recolher Linha",
          "showFilterMenu": "Mostrar Menu de Filtro",
          "hideFilterMenu": "Esconder Menu de Filtro",
          "filterOperator": "Operador de Filtro",
          "filterConstraint": "Restrição de Filtro",
          "editRow": "Editar Linha",
          "saveEdit": "Salvar Edição",
          "cancelEdit": "Cancelar Edição",
          "listView": "Visualização de Lista",
          "gridView": "Visualização de Grade",
          "slide": "Deslizar",
          "slideNumber": "Slide {slideNumber}",
          "zoomImage": "Ampliar Imagem",
          "zoomIn": "Ampliar",
          "zoomOut": "Reduzir",
          "rotateRight": "Rotacionar para a Direita",
          "rotateLeft": "Rotacionar para a Esquerda"
        }
    }
});
app.use(ConfirmationService);
app.use(ToastService);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);

app.use(router);

app.directive('tooltip', Tooltip);
app.directive('badge', BadgeDirective);
app.directive('ripple', Ripple);
app.directive('styleclass', StyleClass);

app.component('Accordion', Accordion);
app.component('AccordionTab', AccordionTab);
app.component('AutoComplete', AutoComplete);
app.component('Avatar', Avatar);
app.component('AvatarGroup', AvatarGroup);
app.component('Badge', Badge);
app.component('Breadcrumb', Breadcrumb);
app.component('Button', Button);
app.component('Calendar', Calendar);
app.component('Card', Card);
app.component('Carousel', Carousel);
app.component('CascadeSelect', CascadeSelect);
app.component('Chart', Chart);
app.component('Checkbox', Checkbox);
app.component('Chip', Chip);
app.component('Chips', Chips);
app.component('ColorPicker', ColorPicker);
app.component('Column', Column);
app.component('ConfirmDialog', ConfirmDialog);
app.component('ConfirmPopup', ConfirmPopup);
app.component('ContextMenu', ContextMenu);
app.component('DataTable', DataTable);
app.component('DataView', DataView);
app.component('DataViewLayoutOptions', DataViewLayoutOptions);
app.component('Dialog', Dialog);
app.component('Divider', Divider);
app.component('Dropdown', Dropdown);
app.component('Fieldset', Fieldset);
app.component('FileUpload', FileUpload);
app.component('Galleria', Galleria);
app.component('Image', Image);
app.component('InlineMessage', InlineMessage);
app.component('Inplace', Inplace);
app.component('InputMask', InputMask);
app.component('TextArea', TextArea);
app.component('InputNumber', InputNumber);
app.component('InputSwitch', InputSwitch);
app.component('InputText', InputText);
app.component('Knob', Knob);
app.component('Listbox', Listbox);
app.component('MegaMenu', MegaMenu);
app.component('Menu', Menu);
app.component('Menubar', Menubar);
app.component('Message', Message);
app.component('MultiSelect', MultiSelect);
app.component('OrderList', OrderList);
app.component('OrganizationChart', OrganizationChart);
app.component('OverlayPanel', OverlayPanel);
app.component('Paginator', Paginator);
app.component('Panel', Panel);
app.component('PanelMenu', PanelMenu);
app.component('Password', Password);
app.component('PickList', PickList);
app.component('ProgressBar', ProgressBar);
app.component('RadioButton', RadioButton);
app.component('Rating', Rating);
app.component('SelectButton', SelectButton);
app.component('ScrollPanel', ScrollPanel);
app.component('ScrollTop', ScrollTop);
app.component('Slider', Slider);
app.component('Sidebar', Sidebar);
app.component('Skeleton', Skeleton);
app.component('SpeedDial', SpeedDial);
app.component('SplitButton', SplitButton);
app.component('Splitter', Splitter);
app.component('SplitterPanel', SplitterPanel);
app.component('Steps', Steps);
app.component('TabMenu', TabMenu);
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);
app.component('Tag', Tag);
app.component('TieredMenu', TieredMenu);
app.component('Timeline', Timeline);
app.component('Toast', Toast);
app.component('Toolbar', Toolbar);
app.component('ToggleButton', ToggleButton);
app.component('Tree', Tree);
app.component('TreeSelect', TreeSelect);
app.component('TreeTable', TreeTable);
app.component('TriStateCheckbox', TriStateCheckbox);
app.component('Editor', Editor);

app.component('BlockViewer', BlockViewer);

app.directive('uppercase', uppercaseDirective);
app.directive('lowercase', lowercaseDirective);
app.directive('required', requiredDirective);

app.component('UWPageBase', UWPageBase);
app.component('UWPageCrud', UWPageCrud);
app.component('UWForm', UWForm);
app.component('UWInput', UWInput);
app.component('UWTextArea', UWTextArea);
app.component('UWSeletor', UWSeletor);
app.component('UWFieldSet', UWFieldSet);
app.component('UWMultiSeletor', UWMultiSeletor);
app.component('UWPickList', UWPickList);
app.component('UWInputMask', UWInputMask);
app.component('UWCalendar', UWCalendar);
app.component('UWParceiroLocal', UWParceiroLocal);
app.component('UWCurrency', UWCurrency);

app.mount('#app');
