import {
  HiOutlineArchiveBox,
  HiOutlineBeaker,
  HiOutlineBookOpen,
  HiOutlineChartBar,
  HiOutlineCircleStack,
  HiOutlineClipboardDocumentCheck,
  HiOutlineCodeBracket,
  HiOutlineCommandLine,
  HiOutlineCube,
  HiOutlineDocumentText,
  HiOutlineGlobeAlt,
  HiOutlineKey,
  HiOutlineLightBulb,
  HiOutlineMap,
  HiOutlineRocketLaunch,
  HiOutlineServerStack,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineSquares2X2,
  HiOutlineWrenchScrewdriver,
} from 'react-icons/hi2'
import { TbGitBranch, TbSnowflake } from 'react-icons/tb'

const ICON_MAP = {
  GitBranch: TbGitBranch,
  BookOpen: HiOutlineBookOpen,
  ArchiveBox: HiOutlineArchiveBox,
  LightBulb: HiOutlineLightBulb,
  ServerStack: HiOutlineServerStack,
  CodeBracket: HiOutlineCodeBracket,
  Key: HiOutlineKey,
  ClipboardCheck: HiOutlineClipboardDocumentCheck,
  RocketLaunch: HiOutlineRocketLaunch,
  Wrench: HiOutlineWrenchScrewdriver,
  DocumentText: HiOutlineDocumentText,
  ShieldCheck: HiOutlineShieldCheck,
  Beaker: HiOutlineBeaker,
  ChartBar: HiOutlineChartBar,
  CircleStack: HiOutlineCircleStack,
  GlobeAlt: HiOutlineGlobeAlt,
  CommandLine: HiOutlineCommandLine,
  Map: HiOutlineMap,
  Cube: HiOutlineCube,
  Sparkles: HiOutlineSparkles,
  Snowflake: TbSnowflake,
  Squares2X2: HiOutlineSquares2X2,
}

export function PortalIcon({ name, className }) {
  const Icon = ICON_MAP[name] ?? HiOutlineSparkles
  return <Icon className={className} aria-hidden />
}
