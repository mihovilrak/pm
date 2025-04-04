import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tab,
  Tabs,
  SelectChangeEvent,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  LooksOne,
  LooksTwo,
  Looks3
} from '@mui/icons-material';
import { useSystemSettings } from '../../hooks/setting/useSystemSettings';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <Box sx={{ mb: 2, '& button': { mr: 1, mb: 1 } }}>
      <Tooltip title="Bold">
        <IconButton
          size="small"
          color={editor.isActive('bold') ? 'primary' : 'default'}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <FormatBold />
        </IconButton>
      </Tooltip>
      <Tooltip title="Italic">
        <IconButton
          size="small"
          color={editor.isActive('italic') ? 'primary' : 'default'}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <FormatItalic />
        </IconButton>
      </Tooltip>
      <Tooltip title="Underline">
        <IconButton
          size="small"
          color={editor.isActive('underline') ? 'primary' : 'default'}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <FormatUnderlined />
        </IconButton>
      </Tooltip>
      <Tooltip title="Heading 1">
        <IconButton
          size="small"
          color={editor.isActive('heading', { level: 1 }) ? 'primary' : 'default'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <LooksOne />
        </IconButton>
      </Tooltip>
      <Tooltip title="Heading 2">
        <IconButton
          size="small"
          color={editor.isActive('heading', { level: 2 }) ? 'primary' : 'default'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <LooksTwo />
        </IconButton>
      </Tooltip>
      <Tooltip title="Heading 3">
        <IconButton
          size="small"
          color={editor.isActive('heading', { level: 3 }) ? 'primary' : 'default'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Looks3 />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

const SystemSettings: React.FC = () => {
  const { state, handleSubmit, handleChange } = useSystemSettings();
  const [tabValue, setTabValue] = React.useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline
    ],
    content: state.settings.welcome_message || '',
    onUpdate: ({ editor }) => {
      handleChange({
        target: {
          name: 'welcome_message',
          value: editor.getHTML()
        }
      } as React.ChangeEvent<HTMLInputElement>);
    }
  });

  React.useEffect(() => {
    if (editor && state.settings.welcome_message !== editor.getHTML()) {
      editor.commands.setContent(state.settings.welcome_message || '');
    }
  }, [editor, state.settings.welcome_message]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleThemeChange = (event: SelectChangeEvent<string>) => {
    handleChange({
      target: {
        name: 'theme',
        value: event.target.value
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  if (state.loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        System Settings
      </Typography>

      {state.error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {state.error}
        </Alert>
      )}

      {state.success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings updated successfully
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="App Name"
            name="app_name"
            value={state.settings.app_name || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Company Name"
            name="company_name"
            value={state.settings.company_name || ''}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Sender Email"
            name="sender_email"
            value={state.settings.sender_email || ''}
            onChange={handleChange}
            fullWidth
            type="email"
          />
          <TextField
            label="Time Zone"
            name="time_zone"
            value={state.settings.time_zone || ''}
            onChange={handleChange}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel id="theme-label">Theme</InputLabel>
            <Select
              labelId="theme-label"
              name="theme"
              value={state.settings.theme || 'light'}
              label="Theme"
              onChange={handleThemeChange}
            >
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
              <MenuItem value="system">System</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ width: '100%', mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Welcome Message
            </Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Editor" />
                <Tab label="Preview" />
              </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ 
                border: '1px solid #ddd', 
                borderRadius: 1,
                '.ProseMirror': {
                  minHeight: '200px',
                  padding: 2,
                  '&:focus': {
                    outline: 'none'
                  }
                }
              }}>
                <MenuBar editor={editor} />
                <EditorContent editor={editor} />
              </Box>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1, minHeight: '200px' }}>
                <div dangerouslySetInnerHTML={{ __html: state.settings.welcome_message || '' }} />
              </Box>
            </TabPanel>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={state.loading}
            sx={{ mt: 2 }}
          >
            {state.loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default SystemSettings;
