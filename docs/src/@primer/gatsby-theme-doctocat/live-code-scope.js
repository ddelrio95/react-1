import * as doctocatComponents from '@primer/gatsby-theme-doctocat'
import {
  AlertIcon,
  ArchiveIcon,
  ArrowRightIcon,
  CalendarIcon,
  CheckIcon,
  DotIcon,
  FilterIcon,
  FlameIcon,
  GearIcon,
  GitCommitIcon,
  IterationsIcon,
  KebabHorizontalIcon,
  LawIcon,
  LinkIcon,
  MailIcon,
  MarkGithubIcon,
  NoteIcon,
  NumberIcon,
  OctofaceIcon,
  PencilIcon,
  PersonIcon,
  ProjectIcon,
  SearchIcon,
  SingleSelectIcon,
  StarIcon,
  TrashIcon,
  TypographyIcon,
  VersionsIcon,
  XIcon,
  ZapIcon
} from '@primer/octicons-react'
import * as primerComponents from '@primer/react'
import * as drafts from '@primer/react/drafts'
import {Placeholder} from '@primer/react/Placeholder'
import React from 'react'
import {AnchoredOverlay} from '../../../../src/AnchoredOverlay'
import {ConfirmationDialog, useConfirm} from '../../../../src/Dialog/ConfirmationDialog'
import {Dialog as Dialog2} from '../../../../src/Dialog/Dialog'
import {SelectPanel} from '../../../../src/SelectPanel/SelectPanel'
import State from '../../../components/State'

const ReactRouterLink = ({to, ...props}) => {
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  return <a href={to} {...props} />
}

export default function resolveScope(metastring) {
  return {
    ...doctocatComponents,
    ...primerComponents,
    ...(metastring.includes('drafts') ? drafts : {}),
    ReactRouterLink,
    State,
    CheckIcon,
    SearchIcon,
    ZapIcon,
    XIcon,
    DotIcon,
    OctofaceIcon,
    PersonIcon,
    MailIcon,
    GitCommitIcon,
    FlameIcon,
    MarkGithubIcon,
    NoteIcon,
    ProjectIcon,
    FilterIcon,
    GearIcon,
    TypographyIcon,
    VersionsIcon,
    LinkIcon,
    LawIcon,
    StarIcon,
    AlertIcon,
    ArrowRightIcon,
    KebabHorizontalIcon,
    PencilIcon,
    ArchiveIcon,
    TrashIcon,
    CalendarIcon,
    IterationsIcon,
    NumberIcon,
    SingleSelectIcon,
    Dialog2,
    ConfirmationDialog,
    useConfirm,
    AnchoredOverlay,
    SelectPanel,
    Placeholder
  }
}
