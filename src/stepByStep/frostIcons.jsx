import {
  HiOutlineArchiveBox,
  HiOutlineBuildingOffice2,
  HiOutlineCamera,
  HiOutlineCheck,
  HiOutlineCheckCircle,
  HiOutlineChevronRight,
  HiOutlineCloud,
  HiOutlineCube,
  HiOutlineCursorArrowRays,
  HiOutlineExclamationTriangle,
  HiOutlineFaceSmile,
  HiOutlineFlag,
  HiOutlineHandRaised,
  HiOutlineLightBulb,
  HiOutlineLockClosed,
  HiOutlineMapPin,
  HiOutlinePencilSquare,
  HiOutlineQuestionMarkCircle,
  HiOutlineSparkles,
  HiOutlineSun,
  HiOutlineTrophy,
  HiOutlineTruck,
  HiOutlineXMark,
} from 'react-icons/hi2'
import { TbCircle, TbPackage, TbScale, TbSnowflake, TbSparkles } from 'react-icons/tb'

/** Claves de icono usadas en paso a paso, partículas y datos */
export const FROST_ICONS = {
  ice: TbSnowflake,
  snow: TbSnowflake,
  cloud: HiOutlineCloud,
  crystal: HiOutlineSparkles,
  aurora: HiOutlineSun,
  check: HiOutlineCheck,
  checkCircle: HiOutlineCheckCircle,
  x: HiOutlineXMark,
  lock: HiOutlineLockClosed,
  package: HiOutlineArchiveBox,
  packageTb: TbPackage,
  cube: HiOutlineCube,
  truck: HiOutlineTruck,
  camera: HiOutlineCamera,
  pencil: HiOutlinePencilSquare,
  trophy: HiOutlineTrophy,
  flag: HiOutlineFlag,
  sparkles: HiOutlineSparkles,
  sparklesTb: TbSparkles,
  snowflake: TbSnowflake,
  scale: TbScale,
  building: HiOutlineBuildingOffice2,
  lightBulb: HiOutlineLightBulb,
  handRaised: HiOutlineHandRaised,
  chevronRight: HiOutlineChevronRight,
  cursor: HiOutlineCursorArrowRays,
  think: HiOutlineQuestionMarkCircle,
  hot: HiOutlineExclamationTriangle,
  celebrate: HiOutlineTrophy,
  mascot: HiOutlineFaceSmile,
  mascotWave: HiOutlineHandRaised,
  circle: TbCircle,
  mapPin: HiOutlineMapPin,
}

/** Icono sugerido por id de ítem de evidencia/documentos */
export const EVIDENCE_ITEM_ICONS = {
  foto: 'camera',
  firma: 'pencil',
  gps: 'mapPin',
  guia: 'package',
  sanitario: 'checkCircle',
  lote: 'cube',
}

export function FrostIcon({ name, className = 'h-5 w-5', ...props }) {
  const Icon = FROST_ICONS[name] ?? HiOutlineSparkles
  return <Icon className={className} aria-hidden {...props} />
}
