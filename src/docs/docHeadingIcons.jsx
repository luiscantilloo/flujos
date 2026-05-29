import {
  HiOutlineArrowPath,
  HiOutlineBookOpen,
  HiOutlineClipboardDocumentList,
  HiOutlineCube,
  HiOutlineDocumentText,
  HiOutlineKey,
  HiOutlineRocketLaunch,
  HiOutlineServer,
  HiOutlineShieldCheck,
  HiOutlineUsers,
  HiOutlineWrenchScrewdriver,
} from 'react-icons/hi2'
import { FiLayers, FiPackage } from 'react-icons/fi'

export function pickHeadingIcon(title) {
  const t = String(title).toLowerCase()

  if (t.includes('readme')) return HiOutlineBookOpen
  if (t.includes('diagrama') || t.includes('arquitectura')) return FiLayers
  if (t.includes('api')) return HiOutlineServer
  if (t.includes('variable') || t.includes('entorno')) return HiOutlineKey
  if (t.includes('instalación') || t.includes('instalacion') || t.includes('ejecución'))
    return HiOutlineRocketLaunch
  if (t.includes('contribut')) return HiOutlineUsers
  if (t.includes('glosario')) return HiOutlineDocumentText
  if (t.includes('flujo') || t.includes('end-to-end')) return HiOutlineArrowPath
  if (t.includes('changelog') || t.includes('versión') || t.includes('version'))
    return HiOutlineClipboardDocumentList
  if (t.includes('test')) return HiOutlineWrenchScrewdriver
  if (t.includes('runbook') || t.includes('deployment') || t.includes('operación'))
    return HiOutlineCube
  if (t.includes('seguridad') || t.includes('auth')) return HiOutlineShieldCheck
  if (t.includes('checklist')) return HiOutlineClipboardDocumentList
  if (t.includes('visión') || t.includes('vision') || t.includes('negocio')) return FiPackage

  return HiOutlineDocumentText
}
